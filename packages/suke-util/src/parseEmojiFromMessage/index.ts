const regex = /<@(\d+):(global|channel)\/>/gm;

export interface ParseEmoji {
    id : string,
    type : "channel" | "global",
    startIndex : number,
    endIndex : number
}

export function parseEmojiFromMessage(str : string) : Array<ParseEmoji> {
    const parseEmojis : Array<ParseEmoji> = []

    let parseEmoji : RegExpExecArray | null;

    while((parseEmoji = regex.exec(str)) !== null) {
        parseEmojis.push({
            id : parseEmoji[1],
            type : parseEmoji[2] as "channel" | "global",
            startIndex : parseEmoji.index,
            endIndex : parseEmoji.index + parseEmoji[0].length
        })
    }

    return parseEmojis
}