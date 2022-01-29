import { Service } from "typedi";
import jwt from "jsonwebtoken";
import { Request , Response } from "express";
import { UserService } from "@suke/suke-server/src/services/user";
import { BaseController } from "../BaseController";

export interface DecodedEmailJWT extends jwt.JwtPayload {
    t : string;
}

@Service()
export class VerifyEmailController extends BaseController {
    public route = "/api/email/verify";

    constructor(
        private userService : UserService
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
            res.status(400).json({ error : true , message : "Token field must be type string."});
            return;
        }


        const { t } = await jwt.verify(token , "khai is not god" , {
            issuer : "Suke",
            subject : "Suke Email Verification"
        }) as DecodedEmailJWT;

        const user = await this.userService.findByEmailToken(t);

        if(!(user)) {
            res.status(400).json({success : false , message : "Email token doesn't exist."});
            return;
        }

        user.isVerified = true;
        user.emailToken = null;

        await this.userService.update(user);

        res.status(200).json({ success : true });
    }
}