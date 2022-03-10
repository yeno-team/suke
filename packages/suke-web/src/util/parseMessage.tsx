import { Emoji } from "@suke/suke-core/src/types/Emoji";
import { Emoji as EmojiComponent } from "@suke/suke-web/src/components/Emoji";
import { parseEmojis } from "@suke/suke-util/src/parseEmojis";
import { binarySearch } from "@suke/suke-util/src/binarysearch";
import React from "react";

export const parseMessage = (emojis : Array<Emoji> , content : string) : JSX.Element => {
    const parsedContent : JSX.Element[] = [];
    const parsedEmojis = parseEmojis(content);
    const filteredParsedEmojis : Array<Emoji> = [];

    for(let i = 0; i < parsedEmojis.length; i++) {
        const emoji = binarySearch(emojis , parsedEmojis[i].id)

        if(!(emoji)) {
            continue
        }

        filteredParsedEmojis.push(emoji as Emoji);
    }

    let remainingContent = content;

    if(filteredParsedEmojis.length > 0) {
        for(let i = 0; i < filteredParsedEmojis.length; i++) {
            const emoji = filteredParsedEmojis[i]
            const parseableStr = `<@${emoji.id}:${emoji.type}/>`
            const matchStrIndex = remainingContent.indexOf(parseableStr)
    
            parsedContent.push(<span className="mr-0.5" key={parseableStr}>{remainingContent.slice(0, matchStrIndex)}</span>)
            remainingContent = remainingContent.slice(matchStrIndex + parseableStr.length, remainingContent.length)
            parsedContent.push(<EmojiComponent className="mr-0.5" emoji={emoji} height={32} width={32}/>)
    
            if((i + 1) === parsedEmojis.length) {
                parsedContent.push(<span key={emoji.type}>{remainingContent}</span>)
            }
        }
    }

    return (
        <React.Fragment>
            {
                parsedContent.length > 0 && filteredParsedEmojis.length > 0 ? parsedContent : <span> {content} </span>
            }
        </React.Fragment>
    )
}