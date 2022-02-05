import { Service } from "typedi";
import { UserService } from "../services/user";
import { BaseController } from "./BaseController";
import { Request, Response , Express } from 'express';
import { User } from "@suke/suke-core/src/entities/User";
import { RateLimiterAbstract } from "rate-limiter-flexible";
import { verifyRecaptchaToken } from "../middlewares/verifyRecaptchaToken";
import { catchErrorAsync } from "../middlewares/catchErrorAsync";
import { EmailUtilService } from "@suke/suke-server/src/services/email";
import { Name } from "@suke/suke-core/src/entities/Name";
import { Email } from "@suke/suke-core/src/entities/Email";
@Service()
export class UserController extends BaseController {
    public rateLimiters: Map<string, RateLimiterAbstract>;
    public route = "/api/user/:id?";

    constructor(
        private userService: UserService,
        private emailUtilService : EmailUtilService
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
        const id = req.params.id;

        if (id == null && req.session.user != null) {
            const foundUser = await this.userService.findById(req.session.user.id);
            
            const serializedUser = {
                ...foundUser,
                email : foundUser.email.currentEmail
            };

            req.session.user = serializedUser;
            res.send(serializedUser);
            return;
        } 
        
        if (id == null) {
            res.status(401).send({
                'message': `You are not logged in.`
            });
            return;
        }

        const foundUser = await this.userService.findById(parseInt(id));

        if (foundUser == null) {
            res.status(404).send({
                'message': `user id '${id}' does not match any user.`
            });
            return;
        }

        res.send({
            ...foundUser,
            salt: null
        });
    }

    public Post = async (req: Request, res: Response): Promise<void> => {
        const userObj = new User({ id: 0, ...req.body , isVerified : false });
        const createdUser = await this.userService.create(userObj , new Email(req.body.email) , req.body.password);
        const tokenAsJwt = await this.emailUtilService.signVerificationToken(createdUser.email.verificationToken);

        try {
            this.emailUtilService.sendVerificationLinkToEmail(new Name(createdUser.name), new Email(createdUser.email.currentEmail) , tokenAsJwt);
        // eslint-disable-next-line no-empty
        } catch (e){}

        // Removes salt from the response.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {salt, channel , ...userRes } = createdUser;

        req.session.user = {
            ...createdUser,
            email : createdUser.email.currentEmail,
        };

        res.status(201).send({
            message: 'Created',
            user: {
                ...userRes,
                email : userRes.email.currentEmail
            }
        });
    }
}