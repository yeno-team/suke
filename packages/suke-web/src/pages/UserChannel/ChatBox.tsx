import { IMessage } from "@suke/suke-core/src/entities/Message"
import { Chat } from "../../components/Chat";
import { useChat } from "../../hooks/useChat";
export interface ChatboxProps {
    username: string;
}

export const ChatBox = ({username}: ChatboxProps) => {

    const defaultMessages: IMessage[] = [
        {
            content: 'hello',
            author: {
                id: 1,
                name: 'hello'
            },
            channelId: username
        },
        {
            content: 'hi',
            author: {
                id: 1,
                name: 'khai2'
            },
            channelId: username
        },
        {
            content: 'bye',
            author: {
                id: 1,
                name: 'man'
            },
            channelId: username
        }
    ]

    const [chatMessages, sendMessage] = useChat(defaultMessages);

    
    return (
        <Chat className="flex-grow" channelId={username} messages={chatMessages} submitMessage={sendMessage}/>
    )
}