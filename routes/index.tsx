import { PageProps } from "$fresh/server.ts";

export default function Home({
  url,
}: Props) {
  return (
    <div class={"h-screen flex justify-center"}>
      <h1>hello world</h1>
    </div>
  );
}

type Props = PageProps;
