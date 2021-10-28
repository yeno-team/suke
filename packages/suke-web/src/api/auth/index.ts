import { parseFetchResponse } from "../parseFetchResponse";
import { postWithJsonData } from "../request";

export const login = async (name: string, pass: string) => {
    const body = {
        name,
        password: pass
    }

    postWithJsonData('/api/auth', body)
        .then(parseFetchResponse)
        .then(data => console.log(data))
        .catch((err) => {
            console.error(err);
        });
}

