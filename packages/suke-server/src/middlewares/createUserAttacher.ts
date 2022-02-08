import {  NextFunction, Request, RequestHandler, Response } from "express";
import { Container } from "typedi";
import { UserService } from "../services/user";
import { Name } from "@suke/suke-core/src/entities/Name/Name";
import { catchErrorAsync } from "./catchErrorAsync";

export enum UserIdentifier {
    Id,
    Username,
    Session
}

/**
 * Attaches a user object to `res.locals.user` if it could find the user using the identifier method provided.
 * It will send a 404 if it could not find the user.
 * 
 * For example, you would use the Id Identifier 
 * if you wanted to make a route that needed the user object 
 * while the client will pass an id to either params, body, or query.
 * 
 * @param identifier 
 * @returns 
 */
export const createUserAttacher = (identifier: UserIdentifier): RequestHandler => catchErrorAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userService = Container.get(UserService);
    
    switch(identifier) {
        case UserIdentifier.Id: {
                const userId = req.params.id || req.body.id || req.query.id;
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
            const username = req.params.name || req.body.name || req.query.name;
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
                    message : "You are not authenticated."
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