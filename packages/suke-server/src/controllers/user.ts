import { Inject, Service } from "typedi";
import { UserService } from "../services/user";
import { MailServerService } from "../services/mailServer";
import { BaseController } from "./BaseController";
import { Request, Response , Express } from 'express';
import { User } from "@suke/suke-core/src/entities/User";
import { RateLimiterAbstract } from "rate-limiter-flexible";
import { verifyRecaptchaToken } from "../middlewares/verifyRecaptchaToken";
import { catchErrorAsync } from "../middlewares/catchErrorAsync";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
@Service()
export class UserController extends BaseController {
    public rateLimiters: Map<string, RateLimiterAbstract>;
    public route = "/api/user/:id?";

    constructor(
        private userService: UserService,
        @Inject("mailServer")
        private mailEmailService : MailServerService
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
            req.session.user = foundUser;
            res.send(foundUser);
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
        const userObj = new User({ id: 0, ...req.body, password: null , isVerified : false });
        const createdUser = await this.userService.create(userObj, req.body.password);

        const jwtEmailToken = await jwt.sign({ t : createdUser.emailToken } , "khai is not god" , { issuer : "Suke" , expiresIn : "5m" , audience : createdUser.name , subject : "Suke Email Verification" });

        try {
            this.mailEmailService.sendMail({
                to : createdUser.email,
                subject : "Suke Email Verification",
                text : jwtEmailToken
            }).then(data => console.log(nodemailer.getTestMessageUrl(data)));


        // eslint-disable-next-line no-empty
        } catch (e){}

        // Removes salt from the response.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {salt, channel , emailToken, ...userRes } = createdUser;
    
        req.session.user = createdUser;
        res.status(201).send({
            message: 'Created',
            user: userRes
        });
    }
}