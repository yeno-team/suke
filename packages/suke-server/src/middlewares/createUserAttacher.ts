import {  NextFunction, Request, RequestHandler, Response } from "express";
import { UserIdentifier } from "@suke/suke-core/src/entities/User/User";
import { Container } from "typedi";
import { UserService } from "../services/user";
import { Name } from "@suke/suke-core/src/entities/Name/Name";
import { catchErrorAsync } from "./catchErrorAsync";

export const createUserAttacher = (identifier: UserIdentifier): RequestHandler => catchErrorAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userService = Container.get(UserService);
    
    switch(identifier) {
        case UserIdentifier.Id: {
                const userId = req.params.id || req.body.id;
                const user = await userService.findById(userId);

                if (user == null) {
                    res.status(404).send({
                        message: `UserId '${userId}' does match any users.`
                    });
                    
                    return;
                }
                
                res.locals.user = user;

                next();
            break;
        }

        case UserIdentifier.Username: {
            const username = req.params.name || req.body.name;

            const nameObj = new Name(username);

            const user = await userService.findByName(nameObj.name);

            if (user == null) {
                res.status(404).send({
                    message: `Username '${username}' does match any users.`
                });

                return;
            }
        
            res.locals.user = user;

            next();
            break;
        }

        case UserIdentifier.Session : {
            if(!(req.session.user)) {
                res.status(401).json({
                    message : "You are unauthenticated."
                });
                return;
            }

            const userId = req.session.user.id;
            const userModel = await userService.findById(userId);

            if(!(userModel)) {
                res.status(500).json({
                    message : "User model not found."
                });
                return;
            }

            res.locals.user = userModel;
            next();
            break;
        }

        default: 
            throw new Error("Unknown User Identifier");
    }
});