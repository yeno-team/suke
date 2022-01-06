import { IReceivedMessage } from "@suke/suke-core/src/entities/ReceivedMessage";
import { Emoji } from "@suke/suke-web/src/components/Emoji";
import React from "react";

export const parseMessage = (message : IReceivedMessage) : JSX.Element => {
    const processedContent : JSX.Element[] = [];
    let remainingContent = message.content;

    if(message.emojis.length > 0) {
        for(let i = 0; i < message.emojis.length; i++) {
            const emoji = message.emojis[i]
            const matchStrIndex = remainingContent.indexOf(emoji.parseableStr)
    
            processedContent.push(<span className="mr-0.5" key={emoji.parseableStr}>{remainingContent.slice(0, matchStrIndex)}</span>)
            remainingContent = remainingContent.slice(matchStrIndex + emoji.parseableStr.length , remainingContent.length)
            processedContent.push(<Emoji className="mr-0.5" emoji={emoji} height={32} width={32} isSelectable={true} isDraggable={false}/>)
    
            if((i + 1) === message.emojis.length) {
                processedContent.push(<span key={emoji.type}>{remainingContent}</span>)
            }
        }
    }

    return (
        <React.Fragment>
            {
                processedContent.length > 0 && message.emojis.length > 0 ? processedContent : <span> {message.content} </span>
            }
        </React.Fragment>
    )
}