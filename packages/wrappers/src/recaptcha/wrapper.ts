import { Service } from "typedi";
import { AxiosRequest } from "@suke/requests/src";
export interface VerifyTokenResponse {
    success : boolean;
    challenge_ts? : string;
    score? : number;
    hostname? : string;
    apk_package_name? : string;
    "error-codes"? : Array<unknown>
}

export interface VerifyTokenOpts {
    secretKey : string;
    token : string;
    ipAddress? : string;
}


@Service()
export class RecaptchaApiWrapper {
    constructor(private request : AxiosRequest) {}

    public async verifyToken(opts : VerifyTokenOpts) : Promise<VerifyTokenResponse> {
        return await this.request.post<VerifyTokenResponse>(new URL("https://www.google.com/recaptcha/api/siteverify") , {
            body : `secret=${opts.secretKey}&response=${opts.token}&remoteip=${opts.ipAddress}`,
            headers : {
                "Content-Type" : "application/x-www-form-urlencoded"
            }
        });
    }

}