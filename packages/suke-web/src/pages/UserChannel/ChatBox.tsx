import { IMessage } from "@suke/suke-core/src/entities/Message"
import useAuth from "@suke/suke-web/src/hooks/useAuth";
import { Chat } from "../../components/Chat";
import { useChat } from "../../hooks/useChat";
export interface ChatboxProps {
    username: string;
    className?: string;
}

export const ChatBox = ({username, className}: ChatboxProps) => {
    const { user } = useAuth();

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
        <Chat className={"flex-grow " + className} channelId={username} user={user} messages={chatMessages} submitMessage={sendMessage}/>
    )
}