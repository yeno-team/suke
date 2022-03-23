import { Emoji } from "@suke/suke-core/src/types/Emoji";
import { parseFetchResponse } from "../parseFetchResponse";
 
export const uploadProfileImage = async (file: File) : Promise<Array<Emoji>> => {
    const data = new FormData();
    data.append("avatar", file);
    const resp = await fetch("/api/image/profile/upload" , { method : "post", body: data})
    return parseFetchResponse(resp);
}