import { Role } from "@suke/suke-core/src/Role";
import { RequestHandler } from "express";

export const isAuthenticated = (opts?: {admin: boolean}) : RequestHandler => (req  , res , next) => {
    if(opts && opts.admin ? req.session.user && req.session.user.role === Role.Admin :  req.session.user) {
        next();
        return;
    }

    res.status(401).json({ 
        message : "You are unauthorized to perform this action."
    });
    return;
};