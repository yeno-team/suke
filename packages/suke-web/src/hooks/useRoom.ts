import { useSocket } from "./useSocket";

export const useRoom = () => {
    const { sendJsonMessage } = useSocket();

    const joinChannelRoom = (roomId: string, password?: string) => {
        sendJsonMessage({
            type: 'CHANNEL_ROOM_JOIN',
            data: {
                roomId,
                password: password || ""
            }
        });
    }

    const leaveChannelRoom = (roomId: string) => {
        sendJsonMessage({
            type: 'CHANNEL_ROOM_LEAVE',
            data: {
                roomId
            }
        });
    }

    const joinTheaterRoom = (roomId: string) => {
        sendJsonMessage({
            type: 'THEATER_ROOM_JOIN',
            data: roomId
        });
    }

    const leaveTheaterRoom = (roomId: string) => {
        sendJsonMessage({
            type: 'THEATER_ROOM_LEAVE',
            data: roomId
        });
    }

    return { joinChannelRoom, leaveChannelRoom, joinTheaterRoom, leaveTheaterRoom};
}