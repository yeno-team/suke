import { ErrorRequestHandler, Request, Response } from "express";

export const ErrorHandler: ErrorRequestHandler = (err, req: Request, res: Response) => {
    console.error(err);

    if (res != null) {
        return res.send({
            error: err.detail != null ? err.detail.toString() : err.message.toString()
        });
    }
}