import React , { useEffect } from "react";
import { useParams } from "react-router";
import { Chat } from "@suke/suke-web/src/components/Chat";
import classNames from "classnames";
import { useChat } from "@suke/suke-web/src/hooks/useChat";
import { useRoom } from "@suke/suke-web/src/hooks/useRoom";
import useAuth from "@suke/suke-web/src/hooks/useAuth";

type ChatEmbedPageParams = {
    channelName : string
}

export const ChatEmbed = () : JSX.Element => {
    const { channelName } = useParams() as ChatEmbedPageParams
    const [ chatMessages , sendMessage ] = useChat([])
    const { user } = useAuth()
    const { joinRoom , leaveRoom } = useRoom()

    useEffect(() => {
        joinRoom(channelName)

        return () => {
            leaveRoom(channelName)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    } , [])

    return (
        <React.Fragment>
            <Chat className={classNames(
            "bg-coolblack",
            "h-screen",
            "flex",
            "flex-col",
            "font-sans",
        )} 
            user={user}
            submitMessage={sendMessage} 
            messages={chatMessages} 
            channelId={channelName}
        />
        </React.Fragment>
    )
}