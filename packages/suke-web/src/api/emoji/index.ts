import { Emoji } from "@suke/suke-core/src/types/Emoji";
import { parseFetchResponse } from "../parseFetchResponse";
 
export const getGlobalEmojis = async () : Promise<Array<Emoji>> => {
    const resp = await fetch("/asset/globalemojis" , { method : "get" })
    return parseFetchResponse(resp)
}