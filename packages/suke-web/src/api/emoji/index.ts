import Jimp from "jimp";
import { steggy } from "@suke/suke-util/src";
import { GlobalEmoji } from "@suke/suke-core/src/types/GlobalEmoji";
 
export const getGlobalEmojis = async () : Promise<Array<GlobalEmoji>> => {
    const image = await Jimp.read("/asset/global.png")
    return JSON.parse(steggy.readMessage(image))
}