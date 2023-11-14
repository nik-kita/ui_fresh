import { SugarWs } from "sugar_ws/mod.ts";
import { id_sugar } from "./online.ts";

export function configure_client({
  id,
  sugar,
}: {
  id: string;
  sugar: SugarWs;
}) {
  sugar.on("message", ({ data }) => {
    // TODO
    Array.from(id_sugar.entries()).forEach(([friend_id, friend]) => {
      if (friend_id === id) return;

      friend.send(data);
    });
  });
}
