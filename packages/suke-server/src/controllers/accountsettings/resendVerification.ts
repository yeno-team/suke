import { Service } from "typedi";
import { Request , Response } from "express";
import { EmailUtilService, EmailDBService } from "@suke/suke-server/src/services/email";
import { BaseController } from "../BaseController";
import { Name } from "@suke/suke-core/src/entities/Name";
import { Express } from "express";
import { isAuthenticated } from "@suke/suke-server/src/middlewares/IsAuthenticated";
import { catchErrorAsync } from "../../middlewares/catchErrorAsync";
import { Email } from "@suke/suke-core/src/entities/Email";
@Service()
export class ResendVerificationController extends BaseController {
    public route = "/api/accountsettings/resendverification";

    constructor(
        private emailDBService : EmailDBService,
        private emailUtilService : EmailUtilService
    ) {
        super();
    }

    public execute(app : Express) : void {
        app.route(this.route).post(isAuthenticated() , catchErrorAsync(this.Post));
    }

    public Post = async(req : Request , res : Response) : Promise<void> => {
        const data = await this.emailDBService.findByUsername(new Name(req.session.user.name));

        if(!(data)) {
            res.status(400).json({ error : true , message : "Something wrong happened."});
            return;
        }

        if(data.user.isVerified) {
            res.status(400).json({ error : true , message : "Your email is already been verified"});
            return;
        }
        
        const token = this.emailUtilService.createVerificationToken();
        data.verificationToken = token;

        // Update the previous verification token to the new one to invalidate it.
        await this.emailDBService.update(data);

        // Create A JWT with the verification token in the payload.
        const tokenAsJWT = await this.emailUtilService.signVerificationToken(token);

        // Send the verification link to the recipient.
        await this.emailUtilService.resendVerificationLinkToEmail(new Name(data.user.name) , new Email(data.currentEmail) , tokenAsJWT);

        res.status(200).json({ success : true });
    }
}