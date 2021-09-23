import { ErrorRequestHandler } from "express";

export const ErrorHandler: ErrorRequestHandler = (err, req, res) => {
    console.error(err);

    return res.status(500).send({
        error: err.detail != null ? err.detail.toString() : err.message.toString()
    });
}