import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(req) {
    const {
      response,
      socket,
    } = Deno.upgradeWebSocket(req);

    socket.send("welcome");

    return response;
  },
};
