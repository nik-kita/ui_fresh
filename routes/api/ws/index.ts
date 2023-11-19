/// <reference lib="deno.unstable" />

import { Handlers } from "$fresh/server.ts";
import { SugarWs } from "sugar_ws/mod.ts";
import { monotonicFactory } from "ulid";

const kv = await Deno.openKv();
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

let i = 0;

async function handle_socket(socket: WebSocket) {
  const sugar = await SugarWs.sugarize(socket).wait_for("open");
  const id = gen_id();

  kv.set(["online", id], { id });

  sugar.onmessage = ({ data }) => {
    kv.set(["messages", id], data);
  };

  const stop = setInterval(() => {
    sugar.send("hello " + ++i);
  }, 1000);

  sugar.once("close", () => {
    Promise.all([
      kv.delete(["online", id]),
      kv.delete(["messages", id]),
    ]);

    clearInterval(stop);
  });
}
