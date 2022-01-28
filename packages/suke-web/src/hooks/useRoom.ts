import { useSocket } from "./useSocket";

export const useRoom = () => {
    const { sendJsonMessage } = useSocket();

    const joinRoom = (roomId: string, password?: string) => {
        sendJsonMessage({
            type: 'ROOM_JOIN',
            data: {
                roomId,
                password: password || ""
            }
        });
    }

    const leaveRoom = (roomId: string) => {
        sendJsonMessage({
            type: 'ROOM_LEAVE',
            data: {
                roomId
            }
        });
    }

    return { joinRoom, leaveRoom };
}