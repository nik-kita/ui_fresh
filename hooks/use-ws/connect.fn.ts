import { SugarWs } from "sugar_ws/mod.ts";
import { WsStateRef, WsUrl } from "./types.ts";

export async function connect(
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
