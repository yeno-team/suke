import { Service } from "typedi";
import { UserService } from "../services/user";
import { BaseController } from "./BaseController";
import { Express, Request, Response } from 'express';

@Service()
export class UserController extends BaseController {
    public route: string = "/api/user/:id";

    constructor(
        private userService: UserService
    ) {
        super();
    }

    public async Get(req: Request, res: Response) {
        const id = req.params.id;

        const user = this.userService.findUserById(parseInt(id));

        res.send(user);
    }
}