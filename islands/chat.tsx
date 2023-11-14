import { useState } from "preact/hooks";
import { useWs } from "../hooks/use-ws/hook.ts";

export default function Chat({
  connection_url,
}: Props) {
  console.log(connection_url);
  const ws = useWs({
    connection_url,
    should_be: "connected",
  })!;
  const [pre, setPre] = useState("");

  ws.add("once", "open", () => setPre("welcome!"));

  return (
    <div>
      <pre>{pre}</pre>
    </div>
  );
}

type Props = {
  connection_url: string;
};
