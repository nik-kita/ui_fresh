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
) {
  if (ws && ws.readyState !== WebSocket.CLOSED) {
    if (ws.readyState === WebSocket.CLOSING) {
      await ws.wait_for("close");
    } else if (ws.readyState === WebSocket.CONNECTING) {
      await ws.wait_for("open");

      if (!even_if_already_connected) return ws;

      await ws.wait_for("close").and_close();
    } else if (ws.readyState === WebSocket.OPEN) {
      if (!even_if_already_connected) return ws;

      await ws.wait_for("close").and_close();
    }
  }

  return new SugarWs(url).wait_for("open");
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
    "on" | "once",
    "message" | "error" | "open" | "close",
    EventListener,
  ][];
};

type WsUrl = `ws${"s" | ""}://${string}`;
