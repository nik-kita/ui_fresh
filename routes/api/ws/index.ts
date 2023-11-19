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

const server_id = gen_id();

kv.listenQueue((data) => {
  if ((data as { type: string }).type !== "message") {
    console.log("unknown data.type in ku.listenQueue:", data);

    return;
  }

  const { server_id: _server_id, ...jData } = data as {
    server_id: string;
    id: string;
    content: string;
    type: "message";
  };

  if (_server_id === _server_id) return;

  for (const o of local_online.values()) {
    o.send_if_open(JSON.stringify(jData));
  }
});

async function handle_socket(socket: WebSocket) {
  const sugar = await SugarWs.sugarize(socket).wait_for("open");
  const id = gen_id();

  sugar.send_if_open(JSON.stringify({
    type: "my_id",
    content: {
      id,
      description: "your own id",
    },
  }));
  sugar.on("message", async ({ data }) => {
    const jData = JSON.parse(data);

    if (jData.type === "message") {
      for (const [_id, socket] of local_online.entries()) {
        if (_id !== id) {
          socket.send_if_open(data);
        }
      }

      await kv.enqueue({
        ...jData,
        server_id,
      });
    }
  });

  await kv.set(["online", id], { id });

  local_online.set(id, sugar);

  sugar.once("close", async () => {
    local_online.delete(id);
    await kv.delete(["online", id]);
  });
}
