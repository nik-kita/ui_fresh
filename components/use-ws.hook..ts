import { useEffect, useRef } from "preact/hooks";
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

    if (ws_state_ref.current.should_be !== "disconnected") {
      ws_state_ref.current.processing = true;

      connect(
        ws_state_ref.current.ws,
        connection_url,
        ws_state_ref.current.should_be === "reconnected",
      )
        .then((ws) => {
          ws_state_ref.current.ws = ws;
          ws_state_ref.current.processing = false;
        });
    } else {
      ws_state_ref.current.processing = true;

      disconnect(ws_state_ref.current.ws)
        .then(() => {
          ws_state_ref.current.ws = null;
          ws_state_ref.current.processing = false;
        });
    }
  }, [ws_state_ref.current.should_be, ws_state_ref.current.processing]);
};

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
