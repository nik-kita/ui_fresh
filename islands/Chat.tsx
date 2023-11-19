import { useState } from "preact/hooks";
import { tw } from "../utils/tw.ts";
import { useWs } from "./hooks/useWs.ts";

export default function Chat({
  connection_url,
}: Props) {
  const {
    is_online,
    turn,
    send,
    on,
  } = useWs(connection_url);
  const [last_message, set_last_message] = useState<object>({});

  on("message", ({ data }: MessageEvent) => {
    const jData = JSON.parse(data);
    set_last_message(jData);
  });

  const monitor = {
    last_message,
  };

  return (
    <div
      class={tw("h-full", {
        "bg-yellow-500": !is_online,

        "bg-green-500": is_online,
      })}
    >
      <div
        class={tw(
          "flex flex-col justify-center items-center h-full gap-5",
        )}
      >
        <button
          class={tw("border-4 p-2 border-slate-500")}
          onClick={() => {
            turn(is_online ? "off" : "on");
          }}
        >
          {is_online ? "disconnect from" : "connect to"} websocket
        </button>
        <pre>{JSON.stringify(monitor, null, 2)}</pre>
      </div>
    </div>
  );
}

type Props = {
  connection_url: string;
};
