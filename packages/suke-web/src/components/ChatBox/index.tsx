import useAuth from "@suke/suke-web/src/hooks/useAuth";
import classNames from "classnames";
import { Chat } from "../../components/Chat";
import { useChat } from "../../hooks/useChat";

export interface ChatboxProps {
    title?: string;
    identifier: string;
    className?: string;
    height?: string;
    channel: string;
}

export const ChatBox = ({identifier, title, height, className, channel}: ChatboxProps) => {
    const { user } = useAuth();


    const [chatMessages, sendMessage] = useChat([]);

    return (
        <Chat channel={channel} className={classNames("bg-coolblack",className)} height={height} channelId={identifier} user={user} title={title} messages={chatMessages} submitMessage={sendMessage} hasUserJoinedRoom={true} doesChannelExist={true}/>
    )
}