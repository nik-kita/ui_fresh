import type { SugarWs } from "sugar_ws/mod.ts";

export async function disconnect(ws: SugarWs | null) {
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
