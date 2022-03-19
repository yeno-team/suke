import { Service } from "typedi";
import { Request , Response } from "express";
import { EmailUtilService, EmailService } from "@suke/suke-server/src/services/email";
import { BaseController } from "../BaseController";
import { Name } from "@suke/suke-core/src/entities/Name";
import { Express } from "express";
import { catchErrorAsync } from "@suke/suke-server/src/middlewares/catchErrorAsync";
import { Email } from "@suke/suke-core/src/entities/Email";
import { createUserAttacher, UserIdentifier } from "@suke/suke-server/src/middlewares/createUserAttacher";

@Service()
export class ResendVerificationController extends BaseController {
    public route = "/api/accountinformation/resendverification";

    constructor(
        private emailService : EmailService,
        private emailUtilService : EmailUtilService
    ) {
        super();
    }

    public execute(app : Express) : void {
        app.route(this.route).post(createUserAttacher(UserIdentifier.Session) , catchErrorAsync(this.Post));
    }

    public Post = async(req : Request , res : Response) : Promise<void> => {
        const user = res.locals.user!;

        if(user.isVerified) {
            res.status(400).json({ 
                message : "Your email is already been verified"
            });
            return;
        }
        
        const token = this.emailUtilService.createVerificationToken();
        user.email.verificationToken = token;

        // Update the previous verification token to the new one to invalidate it.
        await this.emailService.update(user.email);

        // Create A JWT with the verification token in the payload.
        const tokenAsJWT = await this.emailUtilService.signVerificationToken(token);

        // Send the verification link to the recipient.
        this.emailUtilService.resendVerificationLinkToEmail({
            username : new Name(user.name),
            email : new Email(user.email.currentEmail),
            tokenAsJWT,
        });

        res.status(200).json({ success : true });
    }
}