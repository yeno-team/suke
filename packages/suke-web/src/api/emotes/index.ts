import Jimp from "jimp";
import { steggy } from "@suke/suke-util/src"

export const getGlobalEmotes = async () => {
    const resp = await fetch("/asset/global.png")
    const image = await Jimp.read(resp.url)
    console.log(steggy.readMessage(image))
}