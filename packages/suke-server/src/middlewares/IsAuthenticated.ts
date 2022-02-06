import { RequestHandler } from "express";

export const isAuthenticated = () : RequestHandler => (req  , res , next) => {
    if(req.session.user) {
        next();
        return;
    }

    res.status(401).json({ 
        message : "You are unauthorized to perform this action."
    });
    return;
};