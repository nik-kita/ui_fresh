import { SugarWs } from "sugar_ws/mod.ts";
import { http_to_ws } from "./http_to_ws.fn.ts";
import { WsStateRef } from "./types.ts";

export async function connect(ws_state_ref: WsStateRef) {
  const {
    ws,
    listeners,
    connection_url,
    should_be,
  } = ws_state_ref;
  const even_if_already_connected = should_be === "reconnected";

  if (ws) {
    if (ws.readyState === WebSocket.CLOSING) {
      await ws.wait_for("close");
    } else if (ws.readyState === WebSocket.CONNECTING) {
      await ws.wait_for("open");

      if (!even_if_already_connected) return;

      await ws.wait_for("close").and_close();
    } else if (ws.readyState === WebSocket.OPEN) {
      if (!even_if_already_connected) return;

      await ws.wait_for("close").and_close();
    } else if (ws.readyState === WebSocket.CLOSED) {
      // nothing to do
    }
  }

  const sugar = await new SugarWs(http_to_ws(connection_url))
    .wait_for("open")
    .and_add_listeners(listeners);

  for (let i = ws_state_ref.send_queue.length - 1; i !== -1; --i) {
    sugar.send(ws_state_ref.send_queue[i]);
  }

  ws_state_ref.send_queue.splice(0, ws_state_ref.send_queue.length);
}
