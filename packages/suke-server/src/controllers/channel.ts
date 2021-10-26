import { Service } from "typedi";
import { BaseController } from "./BaseController";
import { Request, Response } from 'express';
import { UserService } from "../services/user";
@Service()
export class UserChannelController extends BaseController {
    public route = "/api/channels/:username?";

    constructor(
        private userService: UserService
    ) {
        super();
    }

    public Get = async (req: Request, res: Response): Promise<void> => {
        const username = req.params.username;
        const user = await this.userService.findByName(username);
        
        if (user == null) {
            res.status(404).send({
                message: "User does not exist."
            });

            return;
        }

        res.send(user.channel);
    }
}