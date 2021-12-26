import { Service } from "typedi";
import { BetterTTVApiWrapper } from "@suke/wrappers/src/betterttv";
import { BetterTTVEmote, BetterTTVEmoteOpts, BetterTTVEmoteResponse } from "@suke/wrappers/src/betterttv/types";
import Jimp from "jimp";

export interface CreateEmotePackOpts {
    emotes : BetterTTVEmote[],
    emoteHeight? : number;
    emoteWidth? : number;
}

export interface GetEmotePackOpts {
    pages? : number,
    emoteHeight? : number;
    emoteWidth? : number;
}

export interface EmotePack extends CreateEmotePackResponse {
    emotes : BetterTTVEmote[]
}

export interface GetEmotePackResponse {
    pngEmotePack : CreateEmotePackResponse,
    gifEmotePack : CreateEmotePackResponse
}

export interface EmotePosition {
    x : number;
    y : number;
}

export interface CreateEmotePackResponse {
    image : Jimp;
    positions : Array<EmotePosition>;
    emotes : BetterTTVEmote[]
}

@Service()
export class GlobalEmoteService {
    constructor(
        private betterTTVApiWrapper : BetterTTVApiWrapper
    ) {}

    private async getTrendingEmotes(pages = 2) : Promise<Array<BetterTTVEmote>> {
        // const gifEmotes : Array<BetterTTVEmote> = []
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
        // return emotes
        
        for(let i = 0; i < emotes.length; i++) {
            if(emotes[i].type === "png") {
                pngEmotes.push(emotes[i])
            }
        }

        return pngEmotes
        // return {
        //     gifEmotes,
        //     pngEmotes
        // }
    }

    private async createEmoteAsJimp(emote : BetterTTVEmote) {
        return (await Jimp.read(emote.url.href))
    }

    private async createEmotesAsJimp(emotes : BetterTTVEmote[]) {
        // Sometimes reading the file will throw an error and will return undefined.
        const jimpEmotes = await Promise.all(emotes.map(async (emote) => {
            try {
                return {
                    originalEmote : emote,
                    jimpEmote : await (this.createEmoteAsJimp(emote))
                }

            // eslint-disable-next-line no-empty
            } catch (e) {}
        }))

        // Remove any items that are undefined in the array.
        return jimpEmotes.filter((jimpEmote) => jimpEmote)
    }

    private async createEmotePack({ emotes , emoteHeight = 32 , emoteWidth = 32 } : CreateEmotePackOpts) : Promise<CreateEmotePackResponse> {
        const jimpEmotes = await this.createEmotesAsJimp(emotes)

        // Reassign the emotes variable to an array of emotes that were retrievable using Jimp. 
        emotes = jimpEmotes.map(({ originalEmote }) => originalEmote)
    
        // Calculate the size of the canvas.
        const columns = 32
        const rows = Math.ceil(jimpEmotes.length / columns)
        const width = columns * emoteWidth
        const height = rows * emoteHeight
        const positions = []

        const image = await new Jimp(width , height , 0x0)

        // Calculate the position of each emote on the canvas.
        for(let curRow = 0; curRow < rows; curRow++) {            
            const isLastRow = curRow + 1 === rows
            
            const emotesInCurRow = isLastRow ? (jimpEmotes.length < columns) ? jimpEmotes.length
            : jimpEmotes.length  - (columns * curRow)
            : columns

            for(let curCol = 0; curCol < emotesInCurRow; curCol++) {
                positions.push({ 
                    x : emoteWidth * curCol,
                    y : emoteHeight * curRow
                })
            }
        }

        // Resize and position the emote on the canvas.
        await Promise.all(positions.map(async({ x , y } , index) => {
            const jimpEmote = jimpEmotes[index].jimpEmote
            await jimpEmote.resize(emoteWidth , emoteHeight)
            await image.composite(jimpEmote , x , y)
        }))

        return {
            image,
            emotes,
            positions : positions
        }

    }

    public async getEmotePack(opts : GetEmotePackOpts) : Promise<CreateEmotePackResponse> {
        const emotes = await this.getTrendingEmotes(opts.pages)
        
        const emotePack = await this.createEmotePack({
            emotes : emotes,
            emoteHeight : opts.emoteHeight,
            emoteWidth : opts.emoteWidth
        })

        return emotePack
    }
}