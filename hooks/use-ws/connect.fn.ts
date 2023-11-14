import { SugarWs } from "sugar_ws/mod.ts";
import { http_to_ws } from "./http_to_ws.fn.ts";
import { WsStateRef } from "./types.ts";

export async function connect(
  ws: SugarWs | null,
  url: string,
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

  return new SugarWs(http_to_ws(url))
    .wait_for("open")
    .and_add_listeners(listeners);
}
