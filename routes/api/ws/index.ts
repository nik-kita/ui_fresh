import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(req, ctx) {
    const {
      response,
      socket,
    } = Deno.upgradeWebSocket(req);

    return response;
  },
};
