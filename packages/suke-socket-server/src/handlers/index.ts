import { createChatMessageHandler } from "./chat";
import { createClientErrorHandler, createErrorHandler } from "./error";
import { createTestHandler } from "./test";

export default [
    createTestHandler,
    createErrorHandler,
    createClientErrorHandler,
    createChatMessageHandler
]