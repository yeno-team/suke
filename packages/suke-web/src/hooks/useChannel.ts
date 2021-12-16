import { isRequestsEqual, Request } from "@suke/suke-core/src/entities/Request";
import { SocketMessage, SocketMessageInput } from "@suke/suke-core/src/entities/SocketMessage";
import { RealtimeChannelData } from "@suke/suke-core/src/types/UserChannelRealtime";
import { useEffect, useState } from "react";
import { useChanged } from "./useChanged";
import { useSocket } from "./useSocket";

export const useChannel = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const { send } = useSocket();
    const { messages } = useSocket();
    const [ socketMessagesChanged, prevSocketMessages] = useChanged<SocketMessage[]>(messages);
    const [ channelData, setChannelData ] = useState<RealtimeChannelData>({} as RealtimeChannelData);
    useEffect(() => {
        if (!socketMessagesChanged || prevSocketMessages == null)
            return;

        const newMessages = messages.slice(prevSocketMessages.length);
        const newRequests: Request[] = [];
        const removedRequests: Request[] = [];

        const addNewRequest = (req: Request) => {
            const foundRequest = newRequests.find(v => isRequestsEqual(v, req));
            if (foundRequest == null) {
                newRequests.push(req);
            }
        }

        for (const msg of newMessages) {
            const typedMsg = msg as SocketMessageInput;
            switch (typedMsg.type) {
                case "CHANNEL_REQUEST_ADD":
                    addNewRequest(typedMsg.data)
                    break;
                case "CHANNEL_REQUEST_REMOVE": // TODO: IMPLEMENT THIS
                    removedRequests.push(typedMsg.data)
                    break;
                case "CHANNEL_REQUESTS":
                    for (const req of typedMsg.data) {
                        addNewRequest(req);
                    }
                    break;
                case "CHANNEL_UPDATE":
                    setChannelData(typedMsg.data as RealtimeChannelData);
                    break;
            }
        }

        setRequests([
            ...requests,
            ...newRequests
        ].filter(v => removedRequests.find(removed => isRequestsEqual(v, removed)) == null));
    }, [messages, prevSocketMessages, requests, socketMessagesChanged])


    const createRequest = (request: Request) => {
        send({
            type: 'CHANNEL_REQUEST_ADD',
            data: request
        });
    }

    const removeRequest = (request: Request) => {
        send({
            type: 'CHANNEL_REQUEST_REMOVE',
            data: request
        });
    }

    const getRequests = (roomId: string) => {
        send({
            type: 'CHANNEL_REQUESTS_GET',
            data: roomId
        });
    }

    const updateRealtimeChannelData = (updatedChannelData: Partial<RealtimeChannelData> & { channelId: string }) => {
        send({
            type: 'CHANNEL_UPDATE',
            data: {
                channelId: updatedChannelData.channelId,
                currentVideo: updatedChannelData.currentVideo,
                paused: updatedChannelData.paused,
                progress: updatedChannelData.progress
            }
        });
    }

    return { createRequest, removeRequest, updateRealtimeChannelData, requests, getRequests, channelData};
}