import { Service } from "typedi";
import { BaseController } from "../BaseController";
import { Request , Response } from "express";
import { BetterTTVApiWrapper } from "@suke/wrappers/src/betterttv";
import { BetterTTVEmote, BetterTTVEmoteOpts, BetterTTVEmoteResponse } from "@suke/wrappers/src/betterttv/types";
import Jimp from "jimp";

export interface CreateEmotePackOpts {
    emotes : BetterTTVEmote[],
    emoteHeight? : number;
    emoteWidth? : number;
}

export interface CreateEmojiPackResponse {
    image : Jimp;
    emotes : BetterTTVEmote[];
    positions : {x : number, y : number}[]
}

@Service()
export class GlobalEmoteService {
    constructor(
        private betterTTVApiWrapper : BetterTTVApiWrapper
    ) {}

    private async getTrendingEmotes(pages = 2) : Promise<{ gifEmotes : Array<BetterTTVEmote> , pngEmotes : Array<BetterTTVEmote> }> {
        const gifEmotes : Array<BetterTTVEmote> = []
        const pngEmotes : Array<BetterTTVEmote> = []

        const promises : Array<Promise<BetterTTVEmoteResponse>> = []

        for(let i = 0; i < pages; i++) {
            promises.push(this.betterTTVApiWrapper.getEmotes(new BetterTTVEmoteOpts({
                type : "trending",
                limit : 100,
                offset : i * 100
            })))
        }

        const emotes = await (await Promise.all(promises)).flat()

        for(let i = 0; i < emotes.length; i++) {
            const emote = emotes[i]
            emote.type === "gif" ? gifEmotes.push(emote) : pngEmotes.push(emote)
        }

        return {
            gifEmotes,
            pngEmotes
        }
    }

    private async createEmotesAsJimp(emotes : BetterTTVEmote[]) {
        // Sometimes reading the file will throw an error and will return undefined.
        const jimpEmotes = await Promise.all(emotes.map(async (emote) => {
            try {
                const jimpEmote = await Jimp.read(emote.url.href)

                return {
                    emote,
                    jimpEmote
                }

            // eslint-disable-next-line no-empty
            } catch (e) {}
        }))

        // Remove any items that are undefined in the array.
        return jimpEmotes.filter((jimpEmote) => jimpEmote)
    }

    private async createEmotePack({ emotes , emoteHeight = 32 , emoteWidth = 32 } : CreateEmotePackOpts) : Promise<CreateEmojiPackResponse> {
        const jimpEmotes = await this.createEmotesAsJimp(emotes)

        // Reassign the emotes variable to an array of emotes that were retrievable using Jimp. 
        emotes = jimpEmotes.map(({ emote }) => emote)
    
        // Calculate the size of the canvas.
        const columns = 32
        const rows = Math.ceil(jimpEmotes.length / columns)
        const width = columns * emoteWidth
        const height = rows * emoteHeight
        const emotePositions = []

        const image = await new Jimp(width , height , 0x0)

        // Calculate the position of each emote on the canvas.
        for(let curRow = 0; curRow < rows; curRow++) {            
            const isLastRow = curRow + 1 === rows
            
            const emotesInCurRow = isLastRow ? (jimpEmotes.length < columns) ? jimpEmotes.length
            : jimpEmotes.length  - (columns * curRow)
            : columns

            for(let curCol = 0; curCol < emotesInCurRow; curCol++) {
                emotePositions.push({ 
                    x : emoteWidth * curCol,
                    y : emoteHeight * curRow
                })
            }
        }

        // Resize and position the emote on the canvas.
        await Promise.all(emotePositions.map(async({ x , y } , index) => {
            const jimpEmote = jimpEmotes[index].jimpEmote
            await jimpEmote.resize(emoteWidth , emoteHeight)
            await image.composite(jimpEmote , x , y)
        }))

        return {
            image,
            emotes,
            positions : emotePositions
        }

    }
    
    public async execute() : Promise<any> {
        const { pngEmotes } = await this.getTrendingEmotes(15) 
        const emojiPack = await this.createEmotePack({ emotes : pngEmotes , emoteHeight : 32 , emoteWidth : 32})
        await emojiPack.image.writeAsync("./hello.png")
    }

}

@Service()
export class GlobalEmoteGetController extends BaseController {
    public route = "/api/global_emotes/get";

    constructor(
        private GlobalEmoteService : GlobalEmoteService
    ) {
        super();
    }

    public Get = async (req : Request , res : Response) : Promise<void> => {
        await this.GlobalEmoteService.execute()
        res.status(200).send("hello world")
    }
}