import { useRef, useState } from "preact/hooks";
import { useWs } from "./hooks/use-ws/hook.ts";
import { JSX } from "preact/jsx-runtime";

let messages_id = 0;

export default function Chat({
  connection_url,
}: Props) {
  const ws = useWs({
    connection_url,
    should_be: "connected",
  });
  const [messages, set_messages] = useState<{ id: string; message: string }[]>(
    [],
  );
  const form_ref = useRef<HTMLFormElement>(null);
  const input_message_ref = useRef<HTMLInputElement>(null);
  const handle_form_submit: JSX.GenericEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault();

    const message = input_message_ref.current!.value;

    if (message) {
      ws.send(message.trim().replaceAll("  ", " ").replaceAll("\n\n", "\n"));
      input_message_ref.current!.value = "";
    }
  };

  ws.add("on", "message", ({ data }) => {
    set_messages((prev) => [...prev, JSON.parse(data)]);
  });

  return (
    <div class="h-full">
      <ul
        class={"min-h-[80%] odd:border-slate-800 even:border-slate-600 bg-slate-600 text-white"}
      >
        {...messages.map(({ id, message }) => {
          return (
            <li key={id + ++messages_id} style={{ backgroundColor: id }}>
              <pre>
              {message}
              </pre>
            </li>
          );
        })}
      </ul>
      <hr />
      <form
        class={"h-full flex flex-col gap-4 px-5"}
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
