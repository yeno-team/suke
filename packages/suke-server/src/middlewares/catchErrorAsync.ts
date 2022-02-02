import { RequestHandler } from "express";

export const catchErrorAsync = (func: RequestHandler): RequestHandler => async (req, res, next) => {
    try {
        await func(req, res, next);
    } catch (error) {
        console.log(error);
        next(error);
    }
};