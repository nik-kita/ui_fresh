import { useRef, useState } from "preact/hooks";
import { useWs } from "./hooks/use-ws/hook.ts";
import { JSX } from "preact/jsx-runtime";
import { tw } from "../utils/tw.ts";
import { is_hex_dark } from "../utils/is_hex_dark.ts";

let messages_id = 0;

export default function Chat({
  connection_url,
}: Props) {
  const ws = useWs({
    connection_url,
    should_be: "connected",
  });
  const [is_online, set_is_online] = useState(false);
  const [messages, set_messages] = useState<
    { id: string; message: string; own?: true }[]
  >(
    [],
  );
  const form_ref = useRef<HTMLFormElement>(null);
  const input_message_ref = useRef<HTMLInputElement>(null);
  const me_ref = useRef<{ id: string } | null>(null);
  const handle_form_submit: JSX.GenericEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault();

    const message = input_message_ref.current!.value;

    if (message) {
      if (me_ref.current) {
        ws.send({
          message: message.trim().replaceAll("  ", " ").replaceAll(
            "\n\n",
            "\n",
          ),
          id: me_ref.current.id,
        });
      }
      set_messages((
        prev,
      ) => [...prev, {
        message,
        id: me_ref.current?.id || "#000000",
        own: true,
      }]);
      input_message_ref.current!.value = "";
    }
  };

  ws.add("once", "open", () => {
    set_is_online(true);
  });
  ws.add("once", "close", () => {
    set_is_online(false);
  });
  ws.add("on", "message", ({ data }) => {
    const jData = JSON.parse(data);

    if (!me_ref.current) {
      me_ref.current = { id: jData.id };

      return;
    }

    set_messages((prev) => [...prev, jData]);
  });

  return (
    <div class="h-full">
      <ul
        class={tw(
          `min-h-[80%] odd:border-slate-800 even:border-slate-600  text-white ${
            is_online ? "bg-green-400" : "bg-yellow-400"
          }`,
        )}
      >
        {...messages.map(({ id, message, own }) => {
          return (
            <li
              class={`flex ${own ? "justify-end" : "justify-start"}`}
              key={id + ++messages_id}
            >
              <pre
                style={{
                  backgroundColor: id,
                  color: is_hex_dark(id || "#ffffff") ? "white" : "black",
                }}
                class={"px-2 py-1 rounded-full inline-block mt-2"}
              >
              {message}
              </pre>
            </li>
          );
        })}
      </ul>
      <hr />
      <form
        class={"h-max-[20%] flex flex-col gap-4 px-5"}
        ref={form_ref}
        onSubmit={handle_form_submit}
      >
        <input
          class={"py-2 px-1 bg-slate-100 text-slate-1000"}
          ref={input_message_ref}
          type="text"
          placeholder={"write message..."}
        />
        <input
          class={"bg-slate-900 hover:bg-slate-800 text-slate-100"}
          type="submit"
          value="send"
        />
      </form>
    </div>
  );
}

type Props = {
  connection_url: string;
};
