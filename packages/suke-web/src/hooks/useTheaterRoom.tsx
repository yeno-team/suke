import _ from "lodash";
import { SocketMessageInput } from "@suke/suke-core/src/entities/SocketMessage";
import { RealtimeTheaterRoomData } from "@suke/suke-core/src/types/UserChannelRealtime";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useChanged } from "./useChanged";
import { useSocket } from "./useSocket";


export interface ITheaterRoomContext {
    roomData: RealtimeTheaterRoomData | undefined, 
    requestRoomData: (roomId: string) => void,
    joinTheaterRoom: (roomId: string) => void
}

export const TheaterRoomContext = React.createContext<ITheaterRoomContext>({} as ITheaterRoomContext);

export const TheaterRoomContextProvider = ({children}: {children: React.ReactNode}): JSX.Element => {
    const [roomData, setRoomData] = useState<RealtimeTheaterRoomData>();
    const { sendJsonMessage, messageHistory } = useSocket();
    const [ socketMessagesChanged, prevSocketMessages] = useChanged<SocketMessageInput[]>(messageHistory);
    
    useEffect(() => {
        if (!socketMessagesChanged || prevSocketMessages == null)
            return;

        const newMessages = messageHistory.slice(prevSocketMessages.length);

        for (const msg of newMessages) {
            switch (msg.type) {
                case "THEATER_ROOM_UPDATE": {
                    console.log(msg.data);
                    if (!_.isEqual(roomData, msg.data)) {
                        setRoomData(msg.data as RealtimeTheaterRoomData);
                    }
                }
            }
        }
    }, [messageHistory, prevSocketMessages, roomData, socketMessagesChanged]);

    const value = useMemo(() => {
        const requestRoomData = (roomId: string) => {
            sendJsonMessage({
                type: 'THEATER_ROOM_GET',
                data: roomId
            });
        }

        const joinTheaterRoom = (roomId: string) => {
            sendJsonMessage({
                type: 'THEATER_ROOM_JOIN',
                data: roomId
            });
        }

        return {requestRoomData, roomData, joinTheaterRoom};
    }, [roomData, sendJsonMessage]);


    return (
        <TheaterRoomContext.Provider value={value}>
            {children}
        </TheaterRoomContext.Provider>
    );
}

export const useTheaterRoom = () => {
    return useContext(TheaterRoomContext);
}