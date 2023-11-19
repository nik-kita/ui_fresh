import { tw } from "../utils/tw.ts";

export default function Chat({
  connection_url,
}: Props) {
  return (
    <div class={tw("bg-green-500")}>
      <h1>Hello world</h1>
    </div>
  );
}

type Props = {
  connection_url: string;
};
