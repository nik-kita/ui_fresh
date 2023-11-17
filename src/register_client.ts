import { SugarWs } from "sugar_ws/mod.ts";
import { db_service } from "./db.ts";
import { gen_hex } from "../utils/gen_hex.ts";

export async function register_client(client: WebSocket) {
  const sugar = SugarWs
    .sugarize(client);
  const id = gen_hex();

  await db_service.add_online_user(id);

  await sugar
    .wait_for("open")
    .and((s) => {
      s.send(JSON.stringify({ id }));

      s.once("close", async () => {
        await db_service.rm_online_user(id);
      });
    });

  return [sugar, id] as const;
}
