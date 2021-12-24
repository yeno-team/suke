import { AuthController } from "./auth";
import { UserChannelController } from "./channel";
import { SourceListController } from "./source/list";
import { SourceSearchController } from "./source/search";
import { UserController } from "./user";
import { SourceGetController } from "./source/get";
import { EmojiController } from "./emoji";
import { GlobalEmoteGetController } from "./globalemote/get";

export default [
    AuthController,
    UserChannelController,
    UserController,
    SourceSearchController,
    SourceListController,
    SourceGetController,
    GlobalEmoteGetController
]