import { Express, Request, Response } from "express";
import { UserIdentifier } from "@suke/suke-core/src/entities/User/User";
import { Service } from "typedi";
import { createUserAttacher } from "../middlewares/createUserAttacher";
import { UserService } from "../services/user";
import { BaseController } from "./BaseController";
import { catchErrorAsync } from "../middlewares/catchErrorAsync";
import { setLoginFailRateLimiter } from "../middlewares/setLoginFailRateLimiter";
@Service()
export class AuthController extends BaseController {
    public route = "/api/auth";

    constructor(
        private userService: UserService
    ) {
        super();
    }

    public execute(app: Express): void {
        app.route(this.route + "/login")
            .post(setLoginFailRateLimiter() , createUserAttacher(UserIdentifier.Username), catchErrorAsync(this.Post))
        
        app.route(this.route + "/logout")
            .post(catchErrorAsync(this.Logout))
    } 

    public Post = async (req: Request, res: Response): Promise<void> => {
        if (req.session.user != null) {
            throw new Error("Already Authenticated.");
        }
        
        const password = req.body.password;

        const check = await res.locals.user?.testRawPassword(password);

        if (check) {
            // Login fail Rate Limiter
            const { limiter , key } = res.locals.limiters[1]
            await limiter.delete(key)

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