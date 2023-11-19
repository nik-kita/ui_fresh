import { useEffect, useRef, useState } from "preact/hooks";
import { SugarWs } from "sugar_ws/mod.ts";
import { http_to_ws } from "../../utils/http_to_ws.fn.ts";

const {
  CLOSING,
  CLOSED,
} = WebSocket;

export function useWs(url: string) {
  const x = useRef({
    ws: null as null | SugarWs,
    listeners: new Map<string, {
      on_or_once: "on" | "once";
      label: keyof WebSocketEventMap;
      listener: EvL;
      options?: boolean | AddEventListenerOptions;
      rm_once?: () => void;
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
    check_needed,
    make_check,
  ] = useState(true);

  useEffect(() => {
    const { ws } = x.current;

    if (on_or_off === "on") {
      if (
        !ws ||
        (ws && (ws.readyState === CLOSING || ws.readyState === CLOSED))
      ) {
        const prev = x.current.ws;

        x.current.ws = new SugarWs(http_to_ws(url));
        x.current.ws.wait_for("open").then(() => set_is_online(true));
        x.current.listeners.forEach((l) => {
          const {
            label,
            listener,
            on_or_once,
            options,
          } = l;
          const rm_once_or_void = x.current.ws![on_or_once](
            label,
            listener as EventListener,
            options,
          );

          if (on_or_once === "once") l.rm_once = rm_once_or_void as () => void;
        });

        x.current.ws.once("close", () => {
          set_is_online(false);
          x.current.ws = null;
          make_check((prev) => !prev);
        });

        prev?.close();
      }
    } else {
      if (ws && (ws.readyState !== CLOSING || ws.readyState as 3 !== CLOSED)) {
        ws.close();
      }
    }

    return () => {
      if (ws && (ws.readyState !== CLOSING || ws.readyState as 3 !== CLOSED)) {
        ws.close();
      }
    };
  }, [on_or_off, check_needed]);

  return {
    is_online,
    turn: set_or_on_off,
    on([label, listener, options]: Parameters<SugarWs["once"]>) {
      const key = `on::${label}::${listener.toString()}`;

      if (x.current.listeners.has(key)) return key;

      x.current.listeners.set(key, {
        label,
        listener,
        on_or_once: "on",
        options,
      });

      if (x.current.ws) {
        x.current.ws.on(label, listener as EventListener, options);
      }

      return key;
    },
    once([label, listener, options]: Parameters<SugarWs["once"]>) {
      const key = `once::${label}::${listener.toString()}`;

      if (x.current.listeners.has(key)) return key;

      if (x.current.ws) {
        x.current.ws.once(label, listener, options);
      }

      x.current.listeners.set(key, {
        label,
        listener,
        on_or_once: "once",
        options,
      });

      return key;
    },
    rm(key: string) {
      const rm_target = x.current.listeners.get(key);

      if (!rm_target) return false;

      x.current.listeners.delete(key);

      if (x.current.ws) {
        if (rm_target.rm_once) {
          rm_target.rm_once();
        } else {
          x.current.ws.removeEventListener(
            rm_target.label,
            rm_target.listener as EventListenerOrEventListenerObject,
          );
        }
      }

      return true;
    },
  };
}

type EvL = Parameters<SugarWs["once"]>[1];
