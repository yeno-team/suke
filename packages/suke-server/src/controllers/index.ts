import { AuthController } from "./auth";
import { UserChannelController } from "./channel";
import { SourceListController } from "./source/list";
import { SourceSearchController } from "./source/search";
import { UserController } from "./user";
import { SourceGetController } from "./source/get";
import { GlobalEmojiGetController } from "./globalemoji/get";
import { UserChannelFollowController } from "./follow";
import { UserChannelUnfollowController } from "./unfollow";
import { CategoryGetController } from "./categories/get";
import { RealtimeChannelsController } from "./realtimeChannel";
import { CategoryChannelsController } from "./categories/channels";
import { VerifyEmailController } from "./accountsettings/verifyEmail";

export default [
    AuthController,
    UserChannelController,
    UserChannelFollowController,
    UserChannelUnfollowController,
    UserController,
    SourceSearchController,
    SourceListController,
    SourceGetController,
    GlobalEmojiGetController,
    SourceGetController,
    CategoryGetController,
    CategoryChannelsController,
    RealtimeChannelsController,
    VerifyEmailController
];