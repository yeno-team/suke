import { parseEmojiFromMessage } from "./";
import messageData from "./data.json";

describe("#parseEmojiFromMessage" , () => {
    it("should find no emojis in message" , () => {
        expect(parseEmojiFromMessage("<@eqeqe:global/> among us sus <@12313123123:amoung us/>").length).toBe(0)
        expect(parseEmojiFromMessage("weqeqweqwe wqewqeqwe <@:/> <@:123/>").length).toBe(0)
        expect(parseEmojiFromMessage("<@qewqweqwe:qweqweqweqwe/>").length).toBe(0)
        expect(parseEmojiFromMessage("<@123123:123123123/> <3123131313> 3123123 1231 ad asdwqe3---- <@---:/>").length).toBe(0)
    })

    it("should parse emojis in message" , () => {
        for(let i = 0; i < messageData.length; i++) {
            const data = messageData[i]
            const parseEmojis = parseEmojiFromMessage(data.message)

            expect(parseEmojis.length).toStrictEqual(data.results.length)

            for(let z = 0; z < data.results.length; z++) {
                expect(data.results[z].endIndex).toStrictEqual(parseEmojis[z].endIndex)
                expect(data.results[z].startIndex).toStrictEqual(parseEmojis[z].startIndex)
                expect(data.results[z].type).toStrictEqual(parseEmojis[z].type)
                expect(data.results[z].id).toStrictEqual(parseEmojis[z].id)
            }
        }
    })
})