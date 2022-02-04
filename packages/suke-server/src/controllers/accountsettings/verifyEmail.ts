import { Service } from "typedi";
import { Request , Response } from "express";
import { EmailUtilService, EmailDBService } from "@suke/suke-server/src/services/email";
import { BaseController } from "../BaseController";

@Service()
export class VerifyEmailController extends BaseController {
    public route = "/api/accountsettings/verifyemail";

    constructor(
        private emailDBService : EmailDBService,
        private emailUtilService : EmailUtilService
    ) {
        super();
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
        
        const { t } = await this.emailUtilService.verifyVerificationToken(token);
        const data = await this.emailDBService.findByVerificationToken(t);

        if(!(data)) {
            res.status(400).json({success : false , message : "Token no longer exists."});
            return;
        }

        data.user.isVerified = true;
        data.verificationToken = null;

        await this.emailDBService.update(data);
        res.status(200).json({ success : true });
    }
}