import React , { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Chat } from "@suke/suke-web/src/components/Chat";
import classNames from "classnames";
import { useChat } from "@suke/suke-web/src/hooks/useChat";
import useAuth from "@suke/suke-web/src/hooks/useAuth";
import { getChannel } from "@suke/suke-web/src/api/channel";
import { useRoom } from "@suke/suke-web/src/hooks/useRoom";

type ChatEmbedPageParams = {
    channelId? : string
}

export const ChatEmbed = () : JSX.Element => {
    const { channelId } = useParams() as ChatEmbedPageParams
    const [ doesChannelExist , setDoesChannelExist ] = useState<boolean>(false);
    const [ hasUserJoinedRoom , setHasUserJoinedRoom ] = useState(false);
    const [ chatMessages , sendMessage ] = useChat([]);
    const { user } = useAuth();
    const { joinChannelRoom } = useRoom();

    useEffect(() => {
        const sendGetChannel = async () => {
            if(!(channelId)) {
                setDoesChannelExist(false)
                return
            }

            try {
                await getChannel(channelId)
                joinChannelRoom(channelId)
                setHasUserJoinedRoom(true)
                setDoesChannelExist(true)
            } catch (e) {
                setDoesChannelExist(false)
            } 

        }
        sendGetChannel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    } , [])

    return (
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
            channelId={channelId}
            hasUserJoinedRoom={hasUserJoinedRoom}
            doesChannelExist={doesChannelExist}
            channel="channel"
        />
    )
}