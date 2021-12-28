import Jimp from "jimp";
import { steggy } from "@suke/suke-util/src";
import { GlobalEmote } from "@suke/suke-core/src/types/GlobalEmote";
 
export const getGlobalEmotes = async () : Promise<Array<GlobalEmote>> => {
    const image = await Jimp.read("/asset/global.png")
    return JSON.parse(steggy.readMessage(image))
}