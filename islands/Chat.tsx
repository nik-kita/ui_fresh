import { useState } from "preact/hooks";
import { useWs } from "./hooks/use-ws/hook.ts";

export default function Chat({
  connection_url,
}: Props) {
  const ws = useWs({
    connection_url,
    should_be: "connected",
  });
  const [messages, set_messages] = useState<string[]>([]);

  ws.add("on", "message", ({ data }) => set_messages([...messages, data]));

  return (
    <div>
      <ul>
        {messages.map((m, i) => {
          return (
            <li key={i}>
              <pre>
              {m}
              </pre>
            </li>
          );
        })}
      </ul>
      <hr />
      <form>
        <input type="text" />
        <input type="submit" value="send" />
      </form>
    </div>
  );
}

type Props = {
  connection_url: string;
};
