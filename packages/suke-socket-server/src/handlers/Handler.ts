import { SocketServer } from "../server";

export type Handler = (server: SocketServer, ...args: any) => () => void;