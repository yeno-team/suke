import { createClientErrorHandler, createErrorHandler } from "./error";
import { createTestHandler } from "./test";

export default [
    createTestHandler,
    createErrorHandler,
    createClientErrorHandler
]