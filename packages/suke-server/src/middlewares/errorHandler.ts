import { ErrorRequestHandler, Request, Response } from "express";

export const ErrorHandler: ErrorRequestHandler = (err, req: Request, res: Response) => {
    if (res != null) {
        if (res.send == null) {
            //console.error(err);
            return;
        }

        return res.send({
            error: (err.detail && err.detail.toString()) || 
                   (err.message && err.message.toString() ) || 
                   (err && err.toString()) ||
                   "Unknown Error Occured"
        });
    }
}