import { Service } from "typedi";
import { BaseController } from "./BaseController";
import { Request, Response } from 'express';
import { UserService } from "./../services/user";

@Service()
export class UserChannelFollowController extends BaseController {
    public route = "/api/channels/:username/follow";

    constructor(
        private userService: UserService
    ) {
        super();
    }

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
                message: "Cannot follow yourself"
            });
            return;
        }
        
        const currentAuthUser = await this.userService.findById(req.session.user.id);

        await this.userService.followChannel(user.channel, currentAuthUser);
        
        res.send({
            message: 'Followed user'
        });
    }
}