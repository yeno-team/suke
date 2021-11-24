import { IMessage } from "@suke/suke-core/src/entities/Message"
import { useState } from "react"
import { Chat } from "../../components/Chat";

export const ChatBox = () => {
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

    const submitMessage = (message: IMessage) => {
        setMessages([
            ...messages,
            message
        ]);
    }
    
    return (
        <Chat className="flex-grow" messages={messages} submitMessage={submitMessage} channelName="Among us"/>
    )
}