import { Service } from "typedi";
import { UserService } from "../services/user";
import { BaseController } from "./BaseController";
import { Express, Request, Response } from 'express';
import { User } from "@suke/suke-core/src/entities/User";
import { createUserAttacher } from "../middlewares/createUserAttacher";
import { IUser, UserIdentifier, UserModel } from "@suke/suke-core/src/entities/User/User";
import { catchErrorAsync } from "../middlewares/catchErrorAsync";

@Service()
export class UserController extends BaseController {
    public route = "/api/user/:id?";

    constructor(
        private userService: UserService
    ) {
        super();
    }

    public execute(app: Express): void {
        app.route(this.route)
            .get(createUserAttacher(UserIdentifier.Id), catchErrorAsync(this.Get))
    }

    public Get = async (req: Request, res: Response): Promise<void> => {
        res.send(res.locals.user as IUser);
    }

    public Post = async (req: Request, res: Response): Promise<void> => {
        const userObj = new User({ ...req.body, password: null });

        const createdUser = await this.userService.create(userObj, req.body.password);
        
        // Removes salt from the response.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {salt, ...userRes } = createdUser;

        res.status(201).send({
            message: 'Created',
            user: userRes
        });
    }
}