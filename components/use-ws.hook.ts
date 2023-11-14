import { MutableRef, useEffect, useRef } from "preact/hooks";
import { SugarWs } from "sugar_ws/mod.ts";

export const useWs = ({
  connection_url,
  should_be = "disconnected",
}: {
  connection_url: WsUrl;
  should_be?: keyof Pick<
    Record<WsStateRef["should_be"], unknown>,
    "connected" | "disconnected"
  >;
}) => {
  const ws_state_ref = useRef<WsStateRef>({
    ws: null,
    connection_url,
    processing: false,
    should_be,
    listeners: [],
    rm: new Map(),
  });

  useEffect(() => {
    if (ws_state_ref.current.processing) return;

    effect(ws_state_ref);
  }, [ws_state_ref.current.should_be, ws_state_ref.current.processing]);

  return {
    should(
      ...[be, new_connection_url]:
        | [WsStateRef["should_be"]]
        | [
          keyof Pick<Record<WsStateRef["should_be"], unknown>, "reconnected">,
          WsUrl | void,
        ]
    ) {
      ws_state_ref.current.should_be = be;

      if (new_connection_url) {
        ws_state_ref.current.connection_url = new_connection_url;
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

      ws_state_ref.current.listeners.splice(
        0,
        ws_state_ref.current.listeners.length,
      );
      ws_state_ref.current.rm.clear();
    },
  };
};

async function effect(
  ws_state_ref: MutableRef<WsStateRef>,
) {
  ws_state_ref.current.processing = true;

  if (ws_state_ref.current.should_be !== "disconnected") {
    const ws = await connect(
      ws_state_ref.current.ws,
      ws_state_ref.current.connection_url,
      ws_state_ref.current.should_be === "reconnected",
      ws_state_ref.current.listeners,
    );

    ws_state_ref.current.ws = ws;
  } else {
    ws_state_ref.current.processing = true;

    await disconnect(ws_state_ref.current.ws);

    ws_state_ref.current.ws = null;
  }

  ws_state_ref.current.processing = false;
}

async function connect(
  ws: SugarWs | null,
  url: WsUrl,
  even_if_already_connected = false,
  listeners: WsStateRef["listeners"],
) {
  if (ws) {
    if (ws.readyState === WebSocket.CLOSING) {
      await ws.wait_for("close");
    } else if (ws.readyState === WebSocket.CONNECTING) {
      await ws.wait_for("open");

      if (!even_if_already_connected) return ws;

      await ws.wait_for("close").and_close();
    } else if (ws.readyState === WebSocket.OPEN) {
      if (!even_if_already_connected) return ws;

      await ws.wait_for("close").and_close();
    } else if (ws.readyState === WebSocket.CLOSED) {
      // nothing to do
    }
  }

  return new SugarWs(url)
    .wait_for("open")
    .and_add_listeners(listeners);
}

async function disconnect(ws: SugarWs | null) {
  if (!ws) return;
  if (ws.readyState === WebSocket.CLOSING) {
    await ws.wait_for("close");
  } else if (ws.readyState === WebSocket.CONNECTING) {
    await ws.wait_for("open");
    await ws.wait_for("close").and_close();
  } else if (ws.readyState === WebSocket.OPEN) {
    await ws.wait_for("close").and_close();
  }
}

type WsStateRef = {
  ws: null | SugarWs;
  connection_url: WsUrl;
  should_be: "connected" | "disconnected" | "reconnected";
  processing: boolean;
  listeners: [
    EventListener,
    "message" | "error" | "open" | "close",
    "on" | "once",
  ][];
  rm: Map<string, [string, EventListener | ((message: MessageEvent) => void)]>;
};

type WsUrl = `ws${"s" | ""}://${string}`;
