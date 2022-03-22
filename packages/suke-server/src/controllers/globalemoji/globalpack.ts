// import { Service } from "typedi";
// import { BetterTTVApiWrapper } from "@suke/wrappers/src/betterttv";
// import { BetterTTVEmote, BetterTTVEmoteOpts, BetterTTVEmoteResponse } from "@suke/wrappers/src/betterttv/types";
// import Jimp from "jimp";

// export interface CreateEmojiPackOpts {
//     emotes : BetterTTVEmote[],
//     columnGap? : number;
//     rowGap? : number;
//     emoteHeight? : number;
//     emoteWidth? : number;
// }

// export interface GetEmojiPackOpts {
//     pages? : number,
//     emoteHeight? : number;
//     emoteWidth? : number;
// }

// export interface JimpEmojiData {
//     jimpEmote : Jimp,
//     position : { x : number , y : number }
// }

// export interface CreateEmojiPackData {
//     image : Jimp;
//     data : Array<GlobalEmoji>
// }
// @Service()
// export class GlobalEmojiService {
//     constructor(
//         private betterTTVApiWrapper : BetterTTVApiWrapper
//     ) {}

//     private async getTrendingEmotes(pages = 2) : Promise<Array<BetterTTVEmote>> {
//         const pngEmotes : Array<BetterTTVEmote> = []
//         const promises : Array<Promise<BetterTTVEmoteResponse>> = []

//         for(let i = 0; i < pages; i++) {
//             promises.push(this.betterTTVApiWrapper.getEmotes(new BetterTTVEmoteOpts({
//                 type : "trending",
//                 limit : 100,
//                 offset : i * 100
//             })))
//         }

//         const emotes = await (await Promise.all(promises)).flat()
//         // return emotes
        
//         for(let i = 0; i < emotes.length; i++) {
//             if(emotes[i].type === "png") {
//                 pngEmotes.push(emotes[i])
//             }
//         }

//         return pngEmotes
//     }

//     private async createEmoteAsJimp(emote : BetterTTVEmote) {
//         return (await Jimp.read(emote.url.href))
//     }

//     private async createEmotesAsJimp(emotes : BetterTTVEmote[]) {
//         // Sometimes reading the file will throw an error and will return undefined.
//         const jimpEmotes = await Promise.all(emotes.map(async (emote) => {
//             try {
//                 return {
//                     originalEmote : emote,
//                     jimpEmote : await (this.createEmoteAsJimp(emote))
//                 }

//             // eslint-disable-next-line no-empty
//             } catch (e) {}
//         }))

//         // Remove any items that are undefined in the array.
//         return jimpEmotes.filter((jimpEmote) => jimpEmote)
//     }

//     private async createEmotePack({ 
//         emotes, 
//         emoteHeight = 32,
//         emoteWidth = 32,
//         columnGap = 2,
//         rowGap = 2 
//     } : CreateEmojiPackOpts) : Promise<CreateEmojiPackData> {
//         const jimpEmotes = await this.createEmotesAsJimp(emotes)
//         const jimpEmotePositions : Array<JimpEmojiData> = []

//         const data : Array<GlobalEmoji> = []
    
//         // Calculate the size of the canvas.
//         const columns = 32
//         const rows = Math.ceil(jimpEmotes.length / columns)
//         const width = (columns * emoteWidth) + (columnGap * columns)
//         const height = (rows * emoteHeight) + (rowGap * rows)

//         const image = await new Jimp(width , height , 0x0)

//         // Calculate the position of each emote on the canvas.
//         for(let curRow = 0 , index = 0; curRow < rows; curRow++) {
//             const emotesInCurRow = (rows - 1 === curRow) ?
//             (jimpEmotes.length < columns) ? 
//             jimpEmotes.length : jimpEmotes.length - (columns * curRow)
//             : columns

//             for(let curCol = 0; curCol < emotesInCurRow; curCol++) {
//                 const originalEmote = jimpEmotes[index].originalEmote
//                 const jimpEmote = jimpEmotes[index].jimpEmote
                
//                 const position = {
//                     x : (emoteWidth * curCol) + (curCol !== 0 ? curCol * columnGap : 0),
//                     y : (emoteHeight * curRow) + (curRow !== 0 ? curRow * rowGap : 0)
//                 }

//                 jimpEmotePositions.push({
//                     jimpEmote,
//                     position
//                 })

//                 data.push(new GlobalEmoji({
//                     name : originalEmote.name,
//                     id : index,
//                     url : originalEmote.url,
//                     position,
//                     type : "global"
//                 }))

//                 index++
//             }
//         }

//         // Resize and position the emote on the canvas.
//         await Promise.all(jimpEmotePositions.map(async({ jimpEmote , position }) => {
//             await jimpEmote.resize(emoteWidth, emoteHeight)
//             await image.composite(jimpEmote , position.x , position.y)
//         }))
        
//         return {
//             image,
//             data
//         }
//     }

//     public async getEmotePack(opts : GetEmojiPackOpts) : Promise<CreateEmojiPackData> {
//         const emotes = await this.getTrendingEmotes(opts.pages)
        
//         const emotePack = await this.createEmotePack({
//             emotes : emotes,
//             emoteHeight : opts.emoteHeight,
//             emoteWidth : opts.emoteWidth
//         })


//         return emotePack
//     }
// }

export {};