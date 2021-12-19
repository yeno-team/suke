import { RequestHandler } from "express";
import { Container } from "typedi";
import { RecaptchaApiWrapper } from "@suke/wrappers/src/recaptcha"
import { catchErrorAsync } from "../middlewares/catchErrorAsync";
import config from "../config"

export const verifyRecaptchaToken = () : RequestHandler => catchErrorAsync(async(req , res , next) => {
    const recaptchaApiWrapper = Container.get(RecaptchaApiWrapper)

    console.log(await recaptchaApiWrapper.verifyToken({
        secretKey : config.recaptcha.secretKey,
        token : req.body.reCaptchaToken,
        ipAddress : req.ip
    }))


    next()
    // recaptchaApiWrapper.verifyToken({
    //     secret
    // })

})