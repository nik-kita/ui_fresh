import { MutableRef, useEffect, useRef } from "preact/hooks";
import { SugarWs } from "sugar_ws/mod.ts";

export const useWs = ({
  connection_url,
  should_be = "disconnected",
}: {
  connection_url: `${"ws://" | "wss://"}${string}`;
  should_be?: WsStateRef["should_be"];
}) => {
  const ws_state_ref = useRef<WsStateRef>({
    ws: null,
    processing: false,
    should_be,
  });

  useEffect(() => {
    if (ws_state_ref.current.processing) return;

    effect(ws_state_ref, connection_url);
  }, [ws_state_ref.current.should_be, ws_state_ref.current.processing]);

  return {
    should(be: WsStateRef["should_be"]) {
      ws_state_ref.current.should_be = be;
    },
  };
};

async function effect(
  ws_state_ref: MutableRef<WsStateRef>,
  connection_url: string,
) {
  ws_state_ref.current.processing = true;

  if (ws_state_ref.current.should_be !== "disconnected") {
    const ws = await connect(
      ws_state_ref.current.ws,
      connection_url,
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
  url: string,
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
  should_be: "connected" | "disconnected" | "reconnected";
  processing: boolean;
};
