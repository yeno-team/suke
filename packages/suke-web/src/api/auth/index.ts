import { parseFetchResponse } from "../parseFetchResponse";
import { postWithJsonData } from "../request";


export const login = async (body: {name: string, password: string, reCaptchaToken: string}) => {
    return parseFetchResponse(await postWithJsonData('/api/auth/login', body));
}

export const logout = async () => {
    return parseFetchResponse(await fetch('/api/auth/logout', { method: 'post'}));
}
