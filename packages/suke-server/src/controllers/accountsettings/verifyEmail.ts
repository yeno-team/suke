import { Service } from "typedi";
import { Request , Response } from "express";
import { EmailUtilService, EmailDBService } from "@suke/suke-server/src/services/email";
import { BaseController } from "../BaseController";
import { Express } from "express";
import { isAuthenticated } from "@suke/suke-server/src/middlewares/IsAuthenticated";
import { catchErrorAsync } from "@suke/suke-server/src/middlewares/catchErrorAsync";
@Service()
export class VerifyEmailController extends BaseController {
    public route = "/api/accountsettings/verifyemail";

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
        const { token } = req.body;

        if(!(token)) {
            res.status(400).json({ error : true , message : "Token field is missing."});
            return;
        }

        if(typeof token !== "string") {
            res.status(400).json({ error : true , message : "Token value must be type string."});
            return;
        }
        
        const verifiedToken = await this.emailUtilService.verifyVerificationToken(token);
        const data = await this.emailDBService.findByVerificationToken(verifiedToken);

        if(!(data)) {
            res.status(400).json({success : false , message : "Token no longer exists."});
            return;
        }

        if((data.user.name !== req.session.user.name)) {
            res.status(400).json({ success : false , message : "Token mismatch."});
            return;
        }

        if(!(data.user.isVerified)) {
            data.user.isVerified = true;
            await data.user.save();
        }

        data.verificationToken = null;
        await this.emailDBService.update(data);

        res.status(200).json({ success : true });
    }
}