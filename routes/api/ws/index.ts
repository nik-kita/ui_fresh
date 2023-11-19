/// <reference lib="deno.unstable" />
import { Handlers } from "$fresh/server.ts";
import { SugarWs } from "sugar_ws/mod.ts";
import { monotonicFactory } from "ulid";

const kv = await Deno.openKv();
const local_online = new Map<string, SugarWs>();
const gen_id = monotonicFactory();

export const handler: Handlers = {
  GET(req) {
    const {
      response,
      socket,
    } = Deno.upgradeWebSocket(req);

    void handle_socket(socket);

    return response;
  },
};

async function handle_socket(socket: WebSocket) {
  const sugar = await SugarWs.sugarize(socket).wait_for("open");
  const id = gen_id();

  sugar.send_if_open(JSON.stringify({
    type: "info",
    content: {
      id,
      description: "your own id",
    },
  }));

  await kv.set(["online", id], { id });

  local_online.set(id, sugar);

  sugar.once("close", () => {
    local_online.delete(id);
  });
}
