import { SocketMessageInput } from "@suke/suke-core/src/entities/SocketMessage";
import { TextInput } from "@suke/suke-web/src/components/TextInput"
import { useChanged } from "@suke/suke-web/src/hooks/useChanged";
import { useRoom } from "@suke/suke-web/src/hooks/useRoom";
import { useSocket } from "@suke/suke-web/src/hooks/useSocket";
import React from "react";
import { useEffect, useState } from "react";


export interface PasswordPageProps {
    active: boolean;
    channelId: string;
    setJoinedRoom: (val: boolean) => void;
}

export const PasswordPage = ({active, channelId, setJoinedRoom}: PasswordPageProps) => {
    const [joining, setJoining] = useState(false);
    const { joinChannelRoom } = useRoom();
    const { messageHistory } = useSocket();
    const [ socketMessagesChanged, prevSocketMessages] = useChanged<SocketMessageInput[]>(messageHistory);
    
    const joinPrivateRoom = (passwordInput: string) => {
        joinChannelRoom(channelId, passwordInput);
        setJoining(true);
    }

    useEffect(() => {
        if (!socketMessagesChanged || prevSocketMessages == null)
            return;

        const newMessages = messageHistory.slice(prevSocketMessages!.length);

        for (const msg of newMessages) {
            switch (msg.type) {
                case "CHANNEL_ROOM_JOIN":
                    if (joining) {
                        setJoining(false);
                        setJoinedRoom(true);
                    }
                    break;
            }
        }
    }, [joining, messageHistory, prevSocketMessages, setJoinedRoom, socketMessagesChanged])

    return (
        active ?
        <div className="bg-spaceblack text-center absolute top-0 left-0 h-full w-screen flex justify-center items-center">
            <div>
                <h1 className="text-white font-bold text-lg mb-2">Please enter the channel's password.</h1>
                <TextInput autoComplete="new-password" type="password" placeholder="Password..." className="p-2 px-3 rounded-sm w-full border-0" onInputEnd={joinPrivateRoom} autoSubmit={true}></TextInput>
            </div>
        </div> : null
    )
}
