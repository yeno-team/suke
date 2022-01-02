const regex = /<@(\d+):(global|channel)\/>/gm;

export interface ParsedEmoji {
    matchStr : string,
    id : string,
    type : "channel" | "global",
    startIndex : number,
    endIndex : number
}

export function parseEmojis(str : string) : Array<ParsedEmoji> {
    const parseEmojis : Array<ParsedEmoji> = []
    let parseEmoji : RegExpExecArray | null;

    while((parseEmoji = regex.exec(str)) !== null) {
        parseEmojis.push({
            matchStr : parseEmoji[0],
            id : parseEmoji[1],
            type : parseEmoji[2] as "channel" | "global",
            startIndex : parseEmoji.index,
            endIndex : parseEmoji.index + parseEmoji[0].length
        })
    }

    return parseEmojis
}