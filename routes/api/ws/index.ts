import { Handlers } from "$fresh/server.ts";
import { configure_client } from "./configure_client.ts";
import { register_client } from "./register_client.ts";

export const handler: Handlers = {
  GET(req) {
    const {
      response,
      socket,
    } = Deno.upgradeWebSocket(req);

    // TODO maybe await?
    register_client(socket)
      .then(([sugar, id]) =>
        configure_client({
          sugar,
          id,
        })
      );

    return response;
  },
};
