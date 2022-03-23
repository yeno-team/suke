import { Service } from "typedi";
import { UserService } from "../services/user";
import { BaseController } from "./BaseController";
import { Request, Response , Express } from 'express';
import { IUser, User } from "@suke/suke-core/src/entities/User";
import { RateLimiterAbstract } from "rate-limiter-flexible";
import { verifyRecaptchaToken } from "../middlewares/verifyRecaptchaToken";
import { catchErrorAsync } from "../middlewares/catchErrorAsync";
import { EmailUtilService } from "@suke/suke-server/src/services/email";
import { Name } from "@suke/suke-core/src/entities/Name";
import { Email } from "@suke/suke-core/src/entities/Email";
import { hideEmail } from "@suke/suke-util/src/hideEmail";
@Service()
export class UsersController extends BaseController {
    public rateLimiters!: Map<string, RateLimiterAbstract>;
    public route = "/api/users/:name?";

    constructor(
        private userService: UserService,
    ) {
        super();
    }

    public execute(app : Express) : void {
        app.route(this.route).post(verifyRecaptchaToken() , catchErrorAsync(this.Post));
        app.route(this.route)
            .post(verifyRecaptchaToken() , catchErrorAsync(this.Post))
            .get(catchErrorAsync(this.Get));
    }

    public Get = async (req: Request, res: Response): Promise<void> => {
        const name = req.params.name;

        const foundUser = await this.userService.findByName(name)

        if (foundUser == null) {
            res.status(404).send({
                'message': `username '${name}' does not match any user.`
            });
            return;
        }

        res.send({
            ...foundUser,
            salt: null,
            email : hideEmail(foundUser.email.currentEmail)
        });
    }
}