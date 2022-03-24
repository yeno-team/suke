import { Service } from "typedi";
import { BaseController } from "../BaseController";
import { Request, RequestHandler, Response } from "express";
import { RealtimeChannelService } from "@suke/suke-server/src/services/realtimeChannel";
import { UserService } from "../../services/user";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { isAuthenticated } from "../../middlewares/IsAuthenticated";
import { createUserAttacher, UserIdentifier } from "../../middlewares/createUserAttacher";

@Service()
export class RealtimeFollowedChannelsController extends BaseController {
    public route = "/api/realtime/followedChannels";

    public middlewares: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>[] = [
        isAuthenticated(),
        createUserAttacher(UserIdentifier.Session)
    ];

    constructor(
        private realtimeChannelService: RealtimeChannelService,
        private userService: UserService
    ) {
        super();
    }

    public Get = async (req: Request, res: Response): Promise<void> => {
        let c = 0;
        const output = [];

        for (const follower of res.locals.user?.following || []) {
            if (c > 10) break;

            const user = await this.userService.find({
                relations: [
                    "channel"
                ],
                where: {
                    channel: {
                        id: follower.followedTo.id
                    }
                }
            });

            if (user == null || user.length <= 0) break;
            
            const channel = await this.realtimeChannelService.getChannel(user[0].name);
            if (channel != null && channel.live) {
                output.push(channel);
            }
        }

        res.send(output);
    }
}