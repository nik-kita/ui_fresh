import type { SugarWs } from "sugar_ws/mod.ts";

export type WsStateRef = {
  ws: null | SugarWs;
  connection_url: WsUrl;
  should_be: "connected" | "disconnected" | "reconnected";
  processing: boolean;
  listeners: [
    EventListener,
    "message" | "error" | "open" | "close",
    "on" | "once",
  ][];
  send_queue: string[];
  rm: Map<string, [string, EventListener | ((message: MessageEvent) => void)]>;
};

export type WsUrl = `ws${"s" | ""}://${string}`;
