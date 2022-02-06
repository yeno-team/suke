import { Service } from "typedi";
import { Request , Response , Express } from "express";
import { EmailService, EmailUtilService } from "@suke/suke-server/src/services/email";
import { isAuthenticated } from "@suke/suke-server/src/middlewares/IsAuthenticated";
import { catchErrorAsync } from "@suke/suke-server/src/middlewares/catchErrorAsync";
import { Email } from "@suke/suke-core/src/entities/Email";
import { BaseController } from "../BaseController";
import { UserService } from "@suke/suke-server/src/services/user";
import { Name } from "@suke/suke-core/src/entities/Name";
@Service()
export class ChangeEmailController extends BaseController {
    public route = "/api/accountsettings/changeemail";

    constructor(
        private userService : UserService,
        private emailService : EmailService,
        private emailUtilService : EmailUtilService
    ) {
        super();
    }

    public execute(app : Express) : void {
        app.route(this.route).post(isAuthenticated() , catchErrorAsync(this.Post));
    }

    public Post = async(req : Request , res : Response) : Promise<void> => {
        const { email } = req.body;
        const newEmail = new Email(email);
        const user = await this.userService.findById(req.session.user.id);

        if(!(user)) {
            res.status(500).json({ 
                message : "Session id cannot find the client user."
            });
            return;
        }   

        if((newEmail.value) === (user.email.currentEmail)) {
            res.status(400).json({ 
                message : "Cannot change email address to your current email address."
            });
            return;
        }

        // Set the user verification status to false.
        user.isVerified = false;
        await this.userService.update(user);

        user.email.previousEmail = user.email.currentEmail;
        user.email.currentEmail = newEmail.value;

        const verificationToken = this.emailUtilService.createVerificationToken();
        const verificationTokenAsJWT = await this.emailUtilService.signVerificationToken(verificationToken);

        user.email.verificationToken = verificationToken;
        await this.emailService.update(user.email);

        this.emailUtilService.sendReverifyEmailAddress({
            tokenAsJWT : verificationTokenAsJWT,
            email : newEmail,
            username : new Name(req.session.user.name),
        });

        this.emailUtilService.sendEmailChangeToNewEmail({
            username : new Name(req.session.user.name),
            oldEmail : new Email(user.email.previousEmail),
            newEmail
        });

        res.status(200).json({ success : true });
    }
}