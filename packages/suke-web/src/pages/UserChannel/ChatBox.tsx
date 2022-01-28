
import { IReceivedMessage } from "@suke/suke-core/src/entities/ReceivedMessage";
import useAuth from "@suke/suke-web/src/hooks/useAuth";
import { useScreenSize } from "@suke/suke-web/src/hooks/useScreenSize";
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
    const screen = useScreenSize();
    const [chatMessages, sendMessage] = useChat(defaultMessages);

    return (
        <Chat className={classNames("bg-coolblack",className)} height={screen.width <= 300 ? "48" : "72"} channelId={username} user={user} messages={chatMessages} submitMessage={sendMessage} hasUserJoinedRoom={true} doesChannelExist={true}/>
    )
}