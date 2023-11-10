// @deno-types="npm:@xstate/react"
import { useMachine } from "https://esm.sh/@xstate/react@3.2.2/dist/xstate-react.umd.min.js?alias=react:preact/compat&deps=preact@10.18.1";
import { dog } from "../src/state_machines/dog.ts";

export default function DogMachine() {
  const [state, send] = useMachine(dog);

  const buttons = dog.events.map((ev, i) => {
    const disabled = !state.nextEvents.includes(ev);

    return (
      <button
        class="mt-2 px-4 border hover:border-gray-950 rounded-full bg-slate-300 text-slate-900 disabled:border-gray-600 disabled:text-slate-600 disabled:bg-slate-800"
        key={i}
        onClick={() => send(ev)}
        disabled={disabled}
        type={'button'}
      >
        {ev}
      </button>
    );
  });

  return (
    <div>
      <p class="text-center p-10 text-4xl text-white">
        <span>
          The dog is {typeof state.value === "string"
            ? state.value
            : Object.entries(state.value).flatMap((entry) => entry).join(
              " => ",
            )}
        </span>
      </p>
      <ul class="flex flex-col flex-wrap content-center">
        {buttons}
      </ul>
    </div>
  );
}
