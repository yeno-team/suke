import { useSocket } from "./useSocket";

export const useRoom = () => {
    const { send } = useSocket();
    
    const joinRoom = (roomId: string, password?: string) => {
        send({
            type: 'ROOM_JOIN',
            data: {
                roomId,
                password: password || ""
            }
        });
    }

    const leaveRoom = (roomId: string) => {
        send({
            type: 'ROOM_LEAVE',
            data: {
                roomId
            }
        });
    }

    return { joinRoom, leaveRoom };
}