import { postWithJsonData } from "../request";
import { parseFetchResponse } from "../parseFetchResponse";

export interface VerifyEmailOptions {
    token : string;
}

export const verifyEmail = async (body : VerifyEmailOptions) => {
    await parseFetchResponse(await postWithJsonData("/api/accountsettings/verifyemail" , body))
}