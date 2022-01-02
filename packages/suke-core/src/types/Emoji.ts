import { ParsedEmoji } from "@suke/suke-util/src/parseEmojis";
export interface Emoji {
    url : string;
    id : string;
    name : string;
    type : "global" | "channel";
}

export type MessageEmoji = ParsedEmoji & Emoji