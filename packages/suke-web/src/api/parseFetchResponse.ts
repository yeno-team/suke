import { isValidJson } from "@suke/suke-util";

export const parseFetchResponse = async (resp: Response): Promise<string | any> => {
    const text = await resp.text();

    let response = text;
    if (isValidJson(text)) {
        response = JSON.parse(text);
    } 

    if (resp.status >= 400) {
        return Promise.reject(response);
    }

    return response;
}