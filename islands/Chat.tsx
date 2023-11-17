import { useState } from "preact/hooks";
import { useWs } from "./hooks/use-ws/hook.ts";

export default function Chat({
  connection_url,
}: Props) {
  return (
    <div>
      <h1>Hello world</h1>
    </div>
  );
}

type Props = {
  connection_url: string;
};
