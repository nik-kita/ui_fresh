import type { SugarWs } from "sugar_ws/mod.ts";

export const id_sugar = new Map<string, SugarWs>();
export const sugar_id = new WeakMap<SugarWs, string>();
