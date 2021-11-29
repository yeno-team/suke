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

        if (id == null && req.session.user != null) {
            res.send(req.session.user);
            return;
        } 
        
        if (id == null) {
            res.status(401).send({
                'message': `You are not logged in.`
            });
            return
        }

        const foundUser = await this.userService.findById(parseInt(id));

        if (foundUser == null) {
            res.status(404).send({
                'message': `user id '${id}' does not match any user.`
            });
            return;
        }

        res.send(foundUser);
    }

    public Post = async (req: Request, res: Response): Promise<void> => {
        const userObj = new User({ id: 0, ...req.body, password: null });

        const createdUser = await this.userService.create(userObj, req.body.password);
        
        // Removes salt from the response.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {salt, channel, ...userRes } = createdUser;

        res.status(201).send({
            message: 'Created',
            user: userRes
        });
    }
}