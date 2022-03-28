import { postWithJsonData } from "../request";
import { parseFetchResponse } from "../parseFetchResponse";

export interface VerifyEmailOptions {
    token : string;
}

export interface ChangeEmailOptions {
    password : string;
    email : string;
}

export const verifyEmail = async (body : VerifyEmailOptions) => {
    await parseFetchResponse(await postWithJsonData("/api/accountsettings/verifyemail" , body))
}

export const changeEmail = async (body : ChangeEmailOptions) => {
    await parseFetchResponse(await postWithJsonData("/api/accountsettings/changeemail" , body));
}

export const resendEmail = async() => {
    await postWithJsonData("/api/accountinformation/resendverification" , {});
}

export const changePassword = async (body: {newPassword: string, password: string}) => {
    await parseFetchResponse(await postWithJsonData("/api/accountsettings/change-password", body));
}