import { AuthController } from "./auth";
import { UserChannelController } from "./channel";
import { SourceListController } from "./source/list";
import { SourceSearchController } from "./source/search";
import { UserController } from "./user";

export default [
    AuthController,
    UserChannelController,
    UserController,
    SourceSearchController,
    SourceListController
]