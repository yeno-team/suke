import { createChannelHandler } from "./channel";
import { createChatMessageHandler } from "./chat";
import { createClientErrorHandler, createErrorHandler } from "./error";
import { createRoomJoinHandler } from "./room";
import { createTestHandler } from "./test";

export default [
    createTestHandler,
    createErrorHandler,
    createClientErrorHandler,
    createChatMessageHandler,
    createRoomJoinHandler,
    createChannelHandler
]