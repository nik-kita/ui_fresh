import { useRef, useState } from "preact/hooks";
import { tw } from "../utils/tw.ts";
import { useWs } from "./hooks/useWs.ts";
import { gen_hex } from "../utils/gen_hex.ts";
import { is_hex_light } from "../utils/is_hex_light.ts";

export default function Chat({
  connection_url,
}: Props) {
  const {
    is_online,
    turn,
    send,
    on,
    once,
  } = useWs(connection_url);
  const [messages, set_messages] = useState<{
    id: string;
    content: string;
  }[]>([]);
  const my_id = useRef<string | null>(null);
  const input_ref = useRef<HTMLInputElement>(null);
  const id_hex = useRef(new Map<string, string>());

  once("close", () => {
    my_id.current = null;
  });
  on("message", ({ data }: MessageEvent) => {
    const jData = JSON.parse(data);
    if (!my_id.current && jData.type === "my_id") {
      id_hex.current.set(jData.content.id, gen_hex());
      my_id.current = jData.content.id;

      return;
    } else if (jData.type === "message") {
      if (!id_hex.current.has(jData.id)) {
        id_hex.current.set(jData.id, gen_hex());
      }

      console.log(jData);
      set_messages((prev) => [jData, ...prev]);

      return;
    }
    console.warn("unexpected message:", jData);
  });

  return (
    <div
      class={tw("h-full px-2", {
        "bg-yellow-500": !is_online,

        "bg-green-500": is_online,
      })}
    >
      <div
        class={tw(
          "flex flex-col content-stretch justify-center items-center h-full gap-5",
        )}
      >
        <ul
          class={tw(
            "w-full flex flex-col-reverse items-start h-full overflow-y-scroll gap-x-2",
          )}
        >
          {messages.map(({ content, id }, i) => {
            const backgroundColor = id_hex.current.get(id) ||
              (() => {
                console.warn("unexpected no found hex pair for id");
                return gen_hex();
              })();

            return (
              <li
                key={id + Date.now() + i}
                class={tw(
                  {
                    "text-2xl": content.at(-1) === "!",
                    "self-end": id === my_id.current,
                  },
                )}
              >
                <p
                  class={tw("px-3 py-1 border rounded-full")}
                  style={{
                    backgroundColor,
                    color: is_hex_light(backgroundColor) ? "black" : "white",
                  }}
                >
                  {content.trim()}
                </p>
              </li>
            );
          })}
        </ul>
        <button
          class={tw("border-4 p-2 border-slate-500")}
          onClick={() => {
            turn(is_online ? "off" : "on");
          }}
        >
          {is_online ? "disconnect from" : "connect to"} websocket
        </button>
        <form
          class={tw("flex flex-col gap-2")}
          onSubmit={(ev) => {
            ev.preventDefault();
            if (!input_ref.current) {
              console.warn("where is input ref???");
              return;
            }

            const value = input_ref.current?.value;

            input_ref.current.value = "";

            if (!my_id.current) {
              console.warn("unable to send message without own id");

              return;
            }
            const jMessage = {
              id: my_id.current,
              type: "message",
              content: value,
            };
            set_messages((prev) => [jMessage, ...prev]);
            send(JSON.stringify(jMessage));
          }}
        >
          <input
            class={tw("p-1")}
            ref={input_ref}
            type="text"
            placeholder={"type your message to everyone who is online"}
          />
          <input type="submit" value="send" />
        </form>
      </div>
    </div>
  );
}

type Props = {
  connection_url: string;
};
