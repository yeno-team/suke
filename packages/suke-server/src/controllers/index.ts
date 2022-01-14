import { AuthController } from "./auth";
import { UserChannelController } from "./channel";
import { SourceListController } from "./source/list";
import { SourceSearchController } from "./source/search";
import { UserController } from "./user";
import { SourceGetController } from "./source/get";
import { UserChannelFollowController } from "./follow";
import { UserChannelUnfollowController } from "./unfollow";
import { CategoryController } from "./category";

export default [
    AuthController,
    UserChannelController,
    UserChannelFollowController,
    UserChannelUnfollowController,
    UserController,
    SourceSearchController,
    SourceListController,
    SourceGetController,
    CategoryController
]