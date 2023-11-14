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
  const [messages, set_messages] = useState<string[]>([]);
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
    set_messages((prev) => [...prev, data]);
    console.log(messages);
  });

  return (
    <div>
      <ul>
        {...messages.map((m) => {
          return (
            <li key={++messages_id}>
              <pre>
              {m}
              </pre>
            </li>
          );
        })}
      </ul>
      <hr />
      <form ref={form_ref} onSubmit={handle_form_submit}>
        <input
          ref={input_message_ref}
          type="text"
          placeholder={"write message..."}
        />
        <input type="submit" value="send" />
      </form>
    </div>
  );
}

type Props = {
  connection_url: string;
};
