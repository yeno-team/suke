import { Service } from "typedi";
import { Request , Response , Express } from "express";
import { EmailUtilService, EmailService } from "@suke/suke-server/src/services/email";
import { BaseController } from "../BaseController";
import { isAuthenticated } from "@suke/suke-server/src/middlewares/IsAuthenticated";
import { catchErrorAsync } from "@suke/suke-server/src/middlewares/catchErrorAsync";
@Service()
export class VerifyEmailController extends BaseController {
    public route = "/api/accountsettings/verifyemail";

    constructor(
        private emailService : EmailService,
        private emailUtilService : EmailUtilService
    ) {
        super();
    }

    public execute(app : Express) : void {
        app.route(this.route).post(isAuthenticated() , catchErrorAsync(this.Post));
    }

    public Post = async(req : Request , res : Response) : Promise<void> => {
        const { token : tokenAsJWT } = req.body;

        if(!(tokenAsJWT)) {
            res.status(400).json({ message : "Token field is missing."});
            return;
        }

        if(typeof tokenAsJWT !== "string") {
            res.status(400).json({ message : "Token value must be type string."});
            return;
        }
        
        // Verify the JWT if had been signed with our secret key. 
        const token = await this.emailUtilService.verifyVerificationToken(tokenAsJWT);
        const data = await this.emailService.findByVerificationToken(token);

        if(!(data)) {
            res.status(400).json({ message : "Token no longer exists."});
            return;
        }

        if((data.user.name !== req.session.user.name)) {
            res.status(400).json({ message : "Token mismatch."});
            return;
        }

        if(!(data.user.isVerified)) {
            data.user.isVerified = true;
            await data.user.save();
        }

        data.verificationToken = null;
        await this.emailService.update(data);

        res.status(200).json({ success : true });
    }
}