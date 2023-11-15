import { SugarWs } from "sugar_ws/mod.ts";
import { id_sugar, sugar_id } from "./online.ts";

export async function register_client(client: WebSocket) {
  const sugar = SugarWs
    .sugarize(client);
  const id = gen_id();

  sugar_id.set(sugar, id);
  id_sugar.set(id, sugar);

  await sugar
    .wait_for("open")
    .and((s) => {
      s.once("close", () => {
        id_sugar.delete(id);
        sugar_id.delete(sugar);
      });
    });

  return [sugar, id] as const;
}

// TODO
function gen_id() {
  return Math.random().toString().substring(2) + Date.now();
}
