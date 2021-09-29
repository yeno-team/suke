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

    public Get = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;

        const user = await this.userService.findById(parseInt(id));

        res.send(user);
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