import { SocketMessage, SocketMessageInput } from "@suke/suke-core/src/entities/SocketMessage";
import { TextInput } from "@suke/suke-web/src/components/TextInput"
import { useChanged } from "@suke/suke-web/src/hooks/useChanged";
import { useRoom } from "@suke/suke-web/src/hooks/useRoom";
import { useSocket } from "@suke/suke-web/src/hooks/useSocket";
import { useEffect, useState } from "react";


export interface PasswordPageProps {
    active: boolean;
    channelId: string;
    setJoinedRoom: (val: boolean) => void;
}

export const PasswordPage = ({active, channelId, setJoinedRoom}: PasswordPageProps) => {
    const [joining, setJoining] = useState(false);
    const { joinRoom } = useRoom();
    const { messages } = useSocket();
    const [ socketMessagesChanged, prevSocketMessages] = useChanged<SocketMessage[]>(messages);
    
    const joinPrivateRoom = (passwordInput: string) => {
        console.log(passwordInput)
        joinRoom(channelId, passwordInput);
        setJoining(true);
    }

    useEffect(() => {
        if (!socketMessagesChanged || prevSocketMessages == null)
            return;

        const newMessages = messages.slice(prevSocketMessages!.length);

        for (const msg of newMessages) {
            const typedMsg = msg as SocketMessageInput;
            switch (typedMsg.type) {
                case "ROOM_JOIN":
                    if (joining) {
                        setJoining(false);
                        setJoinedRoom(true);
                    }
                    break;
            }
        }
    }, [joining, messages, prevSocketMessages, setJoinedRoom, socketMessagesChanged])

    return (
        active ?
        <div className="bg-spaceblack text-center absolute top-0 left-0 h-full w-screen flex justify-center items-center">
            <div>
                <h1 className="text-white font-bold text-lg mb-2">Please enter the channel's password.</h1>
                <TextInput autoComplete="new-password" type="password" placeholder="Password..." className="p-2 px-3 rounded-sm w-full border-0" onInputEnd={joinPrivateRoom}></TextInput>
            </div>
        </div> : null
    )
}