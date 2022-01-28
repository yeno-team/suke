import { RequestHandler } from "express";
import { Container } from "typedi";
import { RecaptchaApiWrapper } from "@suke/wrappers/src/recaptcha"
import { catchErrorAsync } from "../middlewares/catchErrorAsync";
import config from "../config"

export const verifyRecaptchaToken = () : RequestHandler => catchErrorAsync(async(req , res , next) => {
    const recaptchaApiWrapper = Container.get(RecaptchaApiWrapper)

    const resp = await recaptchaApiWrapper.verifyToken({
        secretKey : config.recaptcha.secretKey,
        token : req.body.reCaptchaToken,
        ipAddress : req.ip
    })

    if(!(resp.success)) {
        return res.status(400).json({
            success : false,
            message : JSON.stringify(resp["error-codes"])
        })
    }

    if(resp.score < 0.8) {
        return res.status(400).json({
            success : false,
            message : "Client interactions poses high risk and might be fradulent. Please try again later."
        })
    }

    next()
})