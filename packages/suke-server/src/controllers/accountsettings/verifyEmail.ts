import { Service } from "typedi";
import { Request , Response , Express } from "express";
import { EmailUtilService, EmailService } from "@suke/suke-server/src/services/email";
import { BaseController } from "../BaseController";
import { catchErrorAsync } from "@suke/suke-server/src/middlewares/catchErrorAsync";
import { UserService } from "@suke/suke-server/src/services/user";
import { createUserAttacher, UserIdentifier } from "@suke/suke-server/src/middlewares/createUserAttacher";

@Service()
export class VerifyEmailController extends BaseController {
    public route = "/api/accountsettings/verifyemail";

    constructor(
        private userService : UserService,
        private emailService : EmailService,
        private emailUtilService : EmailUtilService
    ) {
        super();
    }

    public execute(app : Express) : void {
        app.route(this.route).post(createUserAttacher(UserIdentifier.Session) , catchErrorAsync(this.Post));
    }

    public Post = async(req : Request , res : Response) : Promise<void> => {
        const { token : tokenAsJWT } = req.body;
        const user = res.locals.user;

        if(!(tokenAsJWT)) {
            res.status(400).json({ message : "Token field is missing."});
            return;
        }

        if(typeof tokenAsJWT !== "string") {
            res.status(400).json({ 
                message : "Token value must be type string."
            });
            return;
        }
        
        // Verify the JWT if had been signed with our secret key. 
        const token = await this.emailUtilService.verifyVerificationToken(tokenAsJWT);
        const userVerificationToken = user.email.verificationToken;

        if(!(userVerificationToken)) {
            res.status(400).json({ 
                message : "No token is assigned to this account at this time."
            });
            return;
        }

        if((userVerificationToken !== token)) {
            res.status(400).json({ message : "Token mismatch."});
            return;
        }

        if(!(user.isVerified)) {
            user.isVerified = true;
            await this.userService.update(user);
        }

        user.email.verificationToken = null;
        await this.emailService.update(user.email);

        res.status(200).json({ success : true });
    }
}