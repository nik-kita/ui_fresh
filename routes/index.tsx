import { PageProps } from "$fresh/server.ts";
import Chat from "../islands/Chat.tsx";
import ChatGrid from "../islands/ChatGrid.tsx";

export default function Home({
  url,
}: Props) {
  return (
    <div class={"h-screen flex justify-center"}>
      <ChatGrid connection_url={`${url.origin}/api/ws`} />
    </div>
  );
}

type Props = PageProps;
