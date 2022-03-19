import { Service } from "typedi";
import { Request , Response , Express } from "express";
import { EmailService, EmailUtilService } from "@suke/suke-server/src/services/email";
import { catchErrorAsync } from "@suke/suke-server/src/middlewares/catchErrorAsync";
import { Email } from "@suke/suke-core/src/entities/Email";
import { BaseController } from "../BaseController";
import { UserService } from "@suke/suke-server/src/services/user";
import { Name } from "@suke/suke-core/src/entities/Name";
import { createUserAttacher, UserIdentifier } from "@suke/suke-server/src/middlewares/createUserAttacher";

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
        app.route(this.route).post(createUserAttacher(UserIdentifier.Session) , catchErrorAsync(this.Post));
    }

    public Post = async(req : Request , res : Response) : Promise<void> => {
        const user = res.locals.user;
        const { email , password } = req.body;

        if (user == null) {
            res.status(401).json({
                message : "Unauthorized."
            });
            return;
        }

        if(!(password)) {
            res.status(400).json({
                message : "Password field is missing."
            });
            return;
        }

        if((typeof password) !== "string") {
            res.status(400).json({
                message : "Password value must be type string."
            });
            return;
        }

        if(!(email)) {
            res.status(400).json({
                message : "Email field is missing."
            });
            return;
        }

        if((typeof email) !== "string") {
            res.status(400).json({
                message : "Email value must be type string"
            });
            return;
        }

        const newEmail = new Email(email);

        if(!(await user.testRawPassword(password))) {
            res.status(400).json({
                message : "Incorrect password."
            });
            return;
        }

        if((newEmail.value) === (user.email.currentEmail)) {
            res.status(400).json({ 
                message : "Cannot change email address to your current email address."
            });
            return;
        }

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
            username : new Name(user.name),
        });

        this.emailUtilService.sendEmailChangeToNewEmail({
            username : new Name(user.name),
            oldEmail : new Email(user.email.previousEmail),
            newEmail
        });

        res.status(200).json({ success : true });
    }
}