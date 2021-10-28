import { isValidJson } from "@suke/suke-util";

export const parseFetchResponse = async (resp: Response) => {
    const text = await resp.text();

    if (isValidJson(text)) {
        return JSON.parse(text);
    } else {
        return text;
    }
}