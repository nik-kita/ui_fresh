import { SugarWs } from "sugar_ws/mod.ts";
import { useRef, useState } from "preact/hooks";

const {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
} = WebSocket;
const READY_STATE = {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
} as const;

export function useWs(url: string) {
  const x = useRef({
    ws: null as null | SugarWs,
    listeners: new Map<string, {
      on_or_once: "on" | "once";
      label: string;
      listener: EvL;
      options?: boolean | AddEventListenerOptions;
    }>(),
  });
  const [
    on_or_off,
    set_or_on_off,
  ] = useState<"on" | "off">("off");
  const [
    is_online,
    set_is_online,
  ] = useState(false);
  const [
    processing,
    set_processing,
  ] = useState(false);

  return {
    is_online,
    turn: set_or_on_off,
    on([label, listener, options]: Parameters<SugarWs["once"]>) {
      const key = `on::${label}::${listener.toString()}`;

      if (x.current.listeners.has(key)) {
        x.current.listeners.set(key, {
          label,
          listener,
          on_or_once: "on",
          options,
        });
      }

      return key;
    },
    once([label, listener, options]: Parameters<SugarWs["once"]>) {
      const key = `once::${label}::${listener.toString()}`;

      if (!x.current.listeners.has(key)) {
        x.current.listeners.set(key, {
          label,
          listener,
          on_or_once: "once",
          options,
        });
      }

      return key;
    },
    rm(key: string) {
      const rm_target = x.current.listeners.get(key);

      if (!rm_target) return false;

      x.current.listeners.delete(key);
      x.current.ws?.removeEventListener(
        rm_target.label,
        rm_target.listener as EventListenerOrEventListenerObject,
      );

      return true;
    },
  };
}

type EvL = Parameters<SugarWs["once"]>[1];
