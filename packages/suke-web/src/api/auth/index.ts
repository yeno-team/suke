import { parseFetchResponse } from "../parseFetchResponse";
import { postWithJsonData } from "../request";

export const login = async (body: {name: string, password: string}) => {
    return parseFetchResponse(await postWithJsonData('/api/auth', body));
}

export const logout = async () => {
    return parseFetchResponse(await fetch('/api/auth/logout', { method: 'post'}));
}