import { useSocket } from "./useSocket";

export const useRoom = () => {
    const { send } = useSocket();
    
    const joinRoom = (roomId: string) => {
        send({
            type: 'ROOM_JOIN',
            data: {
                roomId
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