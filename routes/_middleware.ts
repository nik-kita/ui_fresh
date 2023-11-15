import { MiddlewareHandler } from "$fresh/server.ts";

interface State {
  data: string;
}

export const handler: MiddlewareHandler<State> = (
  req,
  ctx,
) => {
  const url = new URL(req.url);
  const query = Object.fromEntries(url.searchParams);

  if (!query.chat) return ctx.next();

  return new Response(null, {
    status: 301,
    headers: new Headers({
      location: "/hello-world",
    }),
  });
};
