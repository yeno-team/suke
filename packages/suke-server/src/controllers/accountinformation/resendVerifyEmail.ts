import { Service } from "typedi";
import { Request , Response } from "express";
import { BaseController } from "../BaseController";

@Service()
export class ResendVerifyEmailController extends BaseController {
    public route = "/api/accountinformation/resendVerifyEmail";

    constructor() {
        super();
    }

    public Post = async(req : Request , res : Response) : Promise<void>  => {
        
        return;
    }
}