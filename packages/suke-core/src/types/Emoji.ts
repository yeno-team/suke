import { ParseEmoji } from "@suke/suke-util/src/parseEmojiFromMessage"

export interface Emoji {
    url : string,
    id : string,
    name : string,
    type : "global" | "channel"
}

export type MessageEmoji = ParseEmoji & Emoji
