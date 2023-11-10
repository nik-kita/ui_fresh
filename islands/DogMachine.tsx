// @deno-types="npm:@xstate/react"
import { useMachine } from "$npm:@xstate/react";
import { dog } from "../src/state_machines/dog.ts";

export default function DogMachine() {
  const [state, send] = useMachine(dog);

  return (
    <div>
      <h1>{state.value}</h1>
    </div>
  );
}
