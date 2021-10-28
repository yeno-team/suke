import { IUser } from "@suke/suke-core/src/entities/User";
import { parseFetchResponse } from "../parseFetchResponse";
import { postWithJsonData } from "../request";

export const signup = async (user: Pick<IUser, 'name' | 'email'>, password: string) => {
    const body = {
        name: user.name,
        email: user.email,
        password
    };

    postWithJsonData('/api/user', body)
        .then(parseFetchResponse)
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.error(err);
        });
}