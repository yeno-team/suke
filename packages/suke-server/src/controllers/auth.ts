import { Express, Request, Response } from "express";
import { Service } from "typedi";
import { createUserAttacher, UserIdentifier } from "../middlewares/createUserAttacher";
import { BaseController } from "./BaseController";
import { catchErrorAsync } from "../middlewares/catchErrorAsync";
import { setLoginFailRateLimiter } from "../middlewares/setLoginFailRateLimiter";
import { verifyRecaptchaToken } from "../middlewares/verifyRecaptchaToken";
import { User } from "@suke/suke-core/src/entities/User";

@Service()
export class AuthController extends BaseController {
    public route = "/api/auth";

    constructor() {
        super();
    }

    public execute(app: Express): void {
        app.route(this.route + "/login")
            .post(verifyRecaptchaToken(), setLoginFailRateLimiter(), createUserAttacher(UserIdentifier.Username), catchErrorAsync(this.Post));

        app.route(this.route + "/logout")
            .post(catchErrorAsync(this.Logout));
    } 

    public Post = async (req: Request, res: Response): Promise<void> => {
        if (req.session.user != null) {
            throw new Error("Already Authenticated.");
        }
        
        const password = req.body.password;

        const check = await res.locals.user?.testRawPassword(password);

        if (check) {
            // Login fail Rate Limiter
            const { limiter , key } = res.locals.limiters![1];
            await limiter.delete(key);

            req.session.user = new User({
                ...res.locals.user!,
                email: res.locals.user!.email.currentEmail
            });

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

    public Logout = async (req: Request, res: Response): Promise<void> => {
        req.session.destroy((err) => {
            if (err) {
                throw err;
            }

            res.send({
                message: "Successfully logged out."
            });
        });
    }
}