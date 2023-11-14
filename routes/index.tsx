import { PageProps } from "$fresh/server.ts";
import Chat from "../islands/Chat.tsx";

export default function Home({
  url,
}: Props) {
  return (
    <div>
      <Chat connection_url={`${url.origin}/api/ws`} />
    </div>
  );
}

type Props = PageProps;
