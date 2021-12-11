import {  NextFunction, Request, RequestHandler, Response } from "express";
import { UserIdentifier } from "@suke/suke-core/src/entities/User/User";
import { Container } from "typedi";
import { UserService } from "../services/user";
import { Name } from "@suke/suke-core/src/entities/Name/Name";
import { catchErrorAsync } from "./catchErrorAsync";

export const createUserAttacher = (identifier: UserIdentifier): RequestHandler => catchErrorAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userService = Container.get(UserService);

    const { key , limiter } = res.locals.rateLimiter
    const { remainingPoints }  = await limiter.consume(key , 1)

    res.set("X-RateLimit-Remaining" , remainingPoints.toString())
    
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

        default: 
            throw new Error("Unknown User Identifier");
    }
})