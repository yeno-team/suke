import { IUser } from "@suke/suke-core/src/entities/User";
import { parseFetchResponse } from "../parseFetchResponse";
import { postWithJsonData } from "../request";

export const signup = async (user: Pick<IUser, 'name' | 'email'>, password: string) => {
    const body = {
        name: user.name,
        email: user.email,
        password
    };

    return parseFetchResponse(await postWithJsonData('/api/user', body));
}

export const getAuthenticatedUser = async () => {
    return parseFetchResponse(await fetch('/api/user'));
}