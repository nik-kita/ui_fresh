import { PageProps } from "$fresh/server.ts";
import { WsUrl } from "../hooks/use-ws/types.ts";
import Chat from "../islands/chat.tsx";

export default function Home({
  url,
}: Props) {
  return (
    <div>
      <h1>Hello world</h1>
      <Chat connection_url={`${url.origin}/api/ws`} />
    </div>
  );
}

type Props = PageProps;
