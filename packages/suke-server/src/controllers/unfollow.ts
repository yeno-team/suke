import { Service } from "typedi";
import { BaseController } from "./BaseController";
import { Request, Response } from 'express';
import { UserService } from "../services/user";

@Service()
export class UserChannelUnfollowController extends BaseController {
    public route = "/api/channels/:username/unfollow";

    constructor(
        private userService: UserService
    ) {
        super();
    }

    // TODO: https://github.com/typeorm/typeorm/issues/4428
    public Post = async (req: Request, res: Response): Promise<void> => {
        const username = req.params.username;
        const user = await this.userService.findByName(username);

        if (req.session.user == null) {
            res.sendStatus(401);
            return;
        }

        if (user == null) {
            res.status(404).send({
                message: "User does not exist."
            });
            return;
        }

        if (user.name.toLowerCase() === req.session.user.name) {
            res.status(400).send({
                message: "Cannot unfollow yourself"
            });
            return;
        }
        
        const currentAuthUser = await this.userService.findById(req.session.user.id);

        await this.userService.unfollowChannel(user.channel, currentAuthUser!);
        
        res.send({
            message: 'Unfollowed user'
        });
    }
}