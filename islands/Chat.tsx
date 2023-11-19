import { tw } from "../utils/tw.ts";
import { useWs } from "./hooks/useWs.ts";

export default function Chat({
  connection_url,
}: Props) {
  const {
    is_online,
    turn,
  } = useWs(connection_url);

  return (
    <div
      class={tw("h-full", {
        "bg-yellow-500": !is_online,

        "bg-green-500": is_online,
      })}
    >
      <h1>Hello world</h1>
      <h1>{is_online ? "online" : "offline"}</h1>
      <div
        class={tw(
          "flex justify-center items-center border-2 border-slate-500 h-full",
        )}
      >
        <button
          onClick={() => {
            turn(is_online ? "off" : "on");
          }}
        >
          Click!
        </button>
      </div>
    </div>
  );
}

type Props = {
  connection_url: string;
};
