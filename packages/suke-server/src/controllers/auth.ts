import { Express, Request, Response } from "express";
import { UserIdentifier } from "@suke/suke-core/src/entities/User/User";
import { Service } from "typedi";
import { createUserAttacher } from "../middlewares/createUserAttacher";
import { UserService } from "../services/user";
import { BaseController } from "./BaseController";
import { catchErrorAsync } from "../middlewares/catchErrorAsync";

@Service()
export class AuthController extends BaseController {
    public route = "/api/auth";

    constructor(
        private userService: UserService
    ) {
        super();
    }

    public execute(app: Express): void {
        app.route(this.route)
            .post(createUserAttacher(UserIdentifier.Username), catchErrorAsync(this.Post))
    }

    public Post = async (req: Request, res: Response): Promise<void> => {
        const password = req.body.password;
        
        const check = await res.locals.user?.testRawPassword(password);

        if (check) {
            req.session.user = res.locals.user;
            res.send({
                error: false,
                message: "Authenticated."
            });
        } else {
            res.send({
                error: true,
                message: "Incorrect password or username."
            });
        }
    }
}