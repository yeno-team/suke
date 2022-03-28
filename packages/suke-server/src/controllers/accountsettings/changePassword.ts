import { Service } from "typedi";
import { Request , Response, RequestHandler } from "express";
import * as bcrypt from "bcryptjs";
import { BaseController } from "../BaseController";
import { UserService } from "@suke/suke-server/src/services/user";
import { createUserAttacher, UserIdentifier } from "@suke/suke-server/src/middlewares/createUserAttacher";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { isAuthenticated } from "src/middlewares/IsAuthenticated";
import { validatePassword } from "@suke/suke-util";

@Service()
export class ChangePasswordController extends BaseController {
    public route = "/api/accountsettings/change-password";

    public middlewares: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>[] = [
        isAuthenticated(),
        createUserAttacher(UserIdentifier.Session)
    ];

    constructor(
        private userService : UserService
    ) {
        super();
    }
    public Post = async(req : Request , res : Response) : Promise<void> => {
        const { newPassword, password } = req.body; 
        if (newPassword == null || password == null) {
            res.sendStatus(404);
            return;
        }

        const user = res.locals.user;

        if (!user?.testRawPassword(password)) {
            throw new Error("Incorrect Password.");
        }
        
        if (!validatePassword(newPassword)) {
            throw new Error("Password has to be 8 - 15 characters, containing at least one number and one upper case letter.");
        }
        
        user.salt = await bcrypt.hash(newPassword, 6);
        await user.save();
        res.sendStatus(200);
    }
}