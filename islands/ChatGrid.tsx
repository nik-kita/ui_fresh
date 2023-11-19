import { useRef, useState } from "preact/hooks";
import { tw } from "../utils/tw.ts";
import Chat from "./Chat.tsx";

export default function ChatGrid({ connection_url }: Props) {
  const [chats, set_chats] = useState<number[]>([]);

  return (
    <div class={tw("h-full flex flex-col justify-center")}>
      <button
        onClick={() => {
          set_chats((prev) => [...prev, 1]);
        }}
      >
        Generate new chat!
      </button>
      {chats.map((ch, i) => {
        return (
          <Chat
            key={Math.random() + i + "chat"}
            connection_url={connection_url}
          />
        );
      })}
    </div>
  );
}

type Props = {
  connection_url: string;
};
