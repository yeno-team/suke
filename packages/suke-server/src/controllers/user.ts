import { Service } from "typedi";
import { UserService } from "../services/user";
import { BaseController } from "./BaseController";
import { Request, Response } from 'express';
import { User } from "@suke/suke-core/src/entities/User";

@Service()
export class UserController extends BaseController {
    public route = "/api/user/:id?";

    constructor(
        private userService: UserService
    ) {
        super();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public Get = async (req: Request, res: Response) => {
        const id = req.params.id;

        const user = this.userService.findUserById(parseInt(id));

        res.send(user);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public Post = async (req: Request, res: Response) => {
        const userObj = new User(req.body);

        const createdUser = await this.userService.createUser(userObj);

        res.status(200).send({
            message: 'Created',
            user: {
                ...createdUser
            }
        });
    }

}