
import { IReceivedMessage } from "@suke/suke-core/src/entities/ReceivedMessage";
import useAuth from "@suke/suke-web/src/hooks/useAuth";
import classNames from "classnames";
import { Chat } from "../../components/Chat";
import { useChat } from "../../hooks/useChat";

export interface ChatboxProps {
    username: string;
    className?: string;
}

export const ChatBox = ({username, className}: ChatboxProps) => {
    const { user } = useAuth();

    const defaultMessages: IReceivedMessage[] = [
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
        <Chat className={classNames("flex-grow bg-coolblack",className)} height="80" channelId={username} user={user} messages={chatMessages} submitMessage={sendMessage} hasUserJoinedRoom={true} doesChannelExist={true}/>
    )
}