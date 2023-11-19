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
  const engine = useRef({
    ws: null as null | SugarWs,
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
    on(...args: Parameters<SugarWs["on"]>) {
    },
    once(...args: Parameters<SugarWs["once"]>) {
    },
    rm_listener() {
    },
  };
}
