import { SugarWs } from "sugar_ws/mod.ts";
import { db_service, MessageFromUser } from "./db.ts";

export function configure_client({
  id,
  sugar,
}: {
  id: string;
  sugar: SugarWs;
}) {
  db_service._KV.listenQueue((something) => {
    console.log("something", something);
    if (MessageFromUser.is(something)) {
      if (something.from_user === id) {
        return;
      }

      sugar.send_if_open(something.message);
    }
  });
  sugar.on("message", ({ data }) => {
    db_service._KV.enqueue({
      _: "message_from_user",
      from_user: id,
      message: data,
    });
  });
}
