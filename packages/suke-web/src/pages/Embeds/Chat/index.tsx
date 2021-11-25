import React, { useCallback, useState } from "react";
import { useParams } from "react-router";
import { Chat } from "@suke/suke-web/src/components/Chat";
import { IMessage } from "@suke/suke-core/src/entities/Message";
import classNames from "classnames";

type ChatEmbedPageParams = {
    channelName : string
}

export const ChatEmbed = () : JSX.Element => {
    const { channelName } = useParams() as ChatEmbedPageParams

    const defaultMessages: IMessage[] = [
        {
            content: 'hello',
            author: {
                id: 1,
                name: 'hello'
            }
        },
        {
            content: 'hi',
            author: {
                id: 1,
                name: 'khai2'
            }
        },
        {
            content: 'bye',
            author: {
                id: 1,
                name: 'man'
            }
        }
    ]

    const [messages, setMessages] = useState(defaultMessages);

    const submitMessage = useCallback((message : IMessage) => {
        setMessages((prevMessages) => [...prevMessages , message])
    } , [ setMessages ])

    return (
        <Chat className={classNames(
            "bg-coolblack",
            "h-screen",
            "flex",
            "flex-col",
            "font-sans",
        )} 
        submitMessage={submitMessage} 
        messages={messages} 
        channelName={channelName}/>
    )
}