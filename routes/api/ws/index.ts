import { Handlers } from "$fresh/server.ts";
import { configure_client } from "./configure_client.ts";
import { register_client } from "./register_client.ts";

export const handler: Handlers = {
  async GET(req) {
    const {
      response,
      socket,
    } = Deno.upgradeWebSocket(req);

    const [sugar, id] = await register_client(socket);

    configure_client({
      sugar,
      id,
    });

    return response;
  },
};
