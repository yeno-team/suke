const regex = /<@(\d+):(global|channel)\/>/gm;

export interface ParsedEmoji {
    str : string,
    id : string,
    type : "channel" | "global",
}

export function parseEmojis(str : string) : Array<ParsedEmoji> {
    const parseEmojis : Array<ParsedEmoji> = [];
    let parseEmoji : RegExpExecArray | null;

    while((parseEmoji = regex.exec(str)) !== null) {
        parseEmojis.push({
            str : parseEmoji[0],
            id : parseEmoji[1],
            type : parseEmoji[2] as "channel" | "global",
        });
    }

    return parseEmojis;
}