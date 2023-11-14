import { WsStateRef } from "./types.ts";
import { connect } from "./connect.fn.ts";
import { disconnect } from "./disconnect.fn.ts";
import { MutableRef } from "preact/hooks";

export async function effect(
  ws_state_ref: MutableRef<WsStateRef>,
) {
  ws_state_ref.current.processing = true;

  if (ws_state_ref.current.should_be !== "disconnected") {
    await connect(ws_state_ref.current);
  } else {
    await disconnect(ws_state_ref.current.ws);

    ws_state_ref.current.ws = null;
  }

  ws_state_ref.current.processing = false;
}
