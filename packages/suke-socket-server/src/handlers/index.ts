import { createChannelHandler } from "./channel";
import { createChannelRoomHandler } from "./channel/room";
import { createChatMessageHandlers } from "./chat";
import { createClientErrorHandler, createErrorHandler } from "./error";
import { createTestHandler } from "./test";
import { createTheaterHandler } from "./theater";
import { createTheaterRoomHandler } from "./theater/room";

export default [
    createTestHandler,
    createErrorHandler,
    createClientErrorHandler,
    createChatMessageHandlers,
    createChannelHandler,
    createChannelRoomHandler,
    createTheaterHandler,
    createTheaterRoomHandler
];