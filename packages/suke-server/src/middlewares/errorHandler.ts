import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const ErrorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }

    console.error(err);

    res.status(500).send({
        error: true,
        message: (err.detail && err.detail.toString()) || 
               (err.message && err.message.toString() ) || 
               (err && err.toString()) ||
               "Unknown Error Occured"
    });
};