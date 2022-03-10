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
import { ResendVerificationController } from "./accountinformation/resendVerification";
import { ChangeEmailController } from "./accountsettings/changeEmail";
import { TheaterItemsController } from "./theater/items";
import { TheaterItemController } from "./theater";
import { TheaterScheduleItemController } from "./theater/scheduleItem";
import { TheaterScheduleItemsController } from "./theater/scheduleItems";
import { SourceGetDataController } from "./source/getData";
import { ChannelSearchController } from "./search/channel";

export default [
    AuthController,
    UserChannelController,
    UserChannelFollowController,
    UserChannelUnfollowController,
    UserController,
    SourceSearchController,
    SourceListController,
    SourceGetController,
    SourceGetDataController,
    GlobalEmojiGetController,
    SourceGetController,
    CategoryGetController,
    CategoryChannelsController,
    RealtimeChannelsController,
    VerifyEmailController,
    ResendVerificationController,
    ChangeEmailController,
    TheaterItemsController,
    TheaterItemController,
    TheaterScheduleItemController,
    TheaterScheduleItemsController,
    ChannelSearchController
];