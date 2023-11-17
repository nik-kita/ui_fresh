import { useEffect, useRef } from "preact/hooks";
import { effect } from "./effect.fn.ts";
import { http_to_ws } from "./http_to_ws.fn.ts";
import { WsStateRef, WsUrl } from "./types.ts";

export const useWs = ({
  connection_url,
  should_be: _should_be = "disconnected",
}: {
  connection_url: string;
  should_be?: keyof Pick<
    Record<WsStateRef["should_be"], unknown>,
    "connected" | "disconnected"
  >;
}) => {
  const ws_state_ref = useRef<WsStateRef>({
    ws: null,
    connection_url: http_to_ws(connection_url),
    processing: false,
    should_be: _should_be,
    listeners: [],
    rm: new Map(),
    send_queue: [],
  });

  useEffect(() => {
    if (ws_state_ref.current.processing) return;

    effect(ws_state_ref);
  }, [ws_state_ref.current.should_be, ws_state_ref.current.processing]);

  return {
    should(
      ...[should_be, new_connection_url]:
        | [WsStateRef["should_be"]]
        | [
          keyof Pick<Record<WsStateRef["should_be"], unknown>, "reconnected">,
          WsUrl | void,
        ]
    ) {
      ws_state_ref.current.should_be = should_be;

      if (new_connection_url) {
        ws_state_ref.current.connection_url = new_connection_url;
      }
    },
    send(message: MessageEvent["data"]) {
      if (
        ws_state_ref.current.ws &&
        ws_state_ref.current.ws.readyState === WebSocket.OPEN
      ) {
        ws_state_ref.current.ws.send(message);
      } else {
        ws_state_ref.current.send_queue.push(message);
      }
    },
    add<K extends keyof WebSocketEventMap>(
      on_or_once: "on" | "once",
      label: K,
      cb: K extends "message" ? (message: MessageEvent) => void
        : EventListener,
    ) {
      ws_state_ref.current.listeners.push([
        cb as EventListener,
        label,
        on_or_once,
      ]);

      const id = Math.random().toString().substring(2) + Date.now();

      ws_state_ref.current.rm.set(id, [label, cb]);

      return id;
    },
    rm(id: string) {
      const target = ws_state_ref.current.rm.get(id);

      if (!target) return;

      if (ws_state_ref.current.ws) {
        ws_state_ref.current.ws.removeEventListener(
          target[0],
          target[1] as EventListener,
        );
      }

      ws_state_ref.current.rm.delete(id);
    },
    rm_all() {
      if (ws_state_ref.current.ws) {
        ws_state_ref.current.listeners.forEach(([cb, label]) => {
          ws_state_ref.current.ws!.removeEventListener(label, cb);
        });
      }

      ws_state_ref.current.listeners = [];
    },
  };
};
