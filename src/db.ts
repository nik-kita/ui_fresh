/// <reference lib="deno.unstable" />

const KV = await Deno.openKv();
const add_online_user = (id: string) => {
  return KV.set(["user", id], { id });
};
const rm_online_user = (id: string) => {
  return KV.delete(["user", id]);
};

export const db_service = {
  _KV: KV,
  add_online_user,
  rm_online_user,
};

export abstract class User {
  abstract _: "user";
  abstract id: string;
  static is = (user: unknown) => (user as User)._ === "user";
}
export abstract class MessageFromUser {
  abstract _: "message_from_user";
  abstract from_user: string;
  abstract message: string;
  static is = (
    message: unknown,
  ): message is MessageFromUser =>
    (message as MessageFromUser)._ === "message_from_user";
}
