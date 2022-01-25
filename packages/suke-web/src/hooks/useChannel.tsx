import { isRequestsEqual, Request } from "@suke/suke-core/src/entities/Request";
import { SocketMessageInput } from "@suke/suke-core/src/entities/SocketMessage";
import { RealtimeChannelData } from "@suke/suke-core/src/types/UserChannelRealtime";
import { useContext, useEffect, useMemo, useState } from "react";
import { useChanged } from "./useChanged";
import { useSocket } from "./useSocket";
import _ from "lodash";
import React from "react";

export interface ChannelContextInterface {
    requests: Request[],
    channelData: RealtimeChannelData,
    createRequest: (request: Request) => void,
    removeRequest: (request: Request) => void,
    getRequests: (roomId: string) => void,
    requestChannelData: (roomId: string) => void,
    updateRealtimeChannelData: (updatedChannelData: Partial<RealtimeChannelData> & { channelId: string }) => void
}

export const ChannelContext = React.createContext<ChannelContextInterface>({} as ChannelContextInterface);

export const ChannelContextProvider = ({children}: {children: React.ReactNode}): JSX.Element => {
    const [requests, setRequests] = useState<Request[]>([]);
    const { sendJsonMessage, messageHistory } = useSocket();
    const [ socketMessagesChanged, prevSocketMessages] = useChanged<SocketMessageInput[]>(messageHistory);
    const [ channelData, setChannelData ] = useState<RealtimeChannelData>({} as RealtimeChannelData);

    useEffect(() => {
        if (!socketMessagesChanged || prevSocketMessages == null)
            return;

        const newMessages = messageHistory.slice(prevSocketMessages.length);
        const newRequests: Request[] = [];
        const removedRequests: Request[] = [];

        const addNewRequest = (req: Request) => {
            const foundRequest = newRequests.find(v => isRequestsEqual(v, req));
            if (foundRequest == null) {
                newRequests.push(req);
            }
        }

        for (const msg of newMessages) {
            switch (msg.type) {
                case "CHANNEL_REQUEST_ADD":
                    addNewRequest(msg.data)
                    break;
                case "CHANNEL_REQUEST_REMOVE": 
                    removedRequests.push(msg.data)
                    break;
                case "CHANNEL_REQUESTS":
                    for (const req of msg.data) {
                        addNewRequest(req);
                    }
                    break;
                case "CHANNEL_UPDATE": {
                    const oldData: RealtimeChannelData = {
                        id: channelData.id!,
                        title: channelData.title!,
                        category: channelData.category!,
                        viewerCount: channelData.viewerCount!,
                        thumbnail: channelData.thumbnail!,
                        currentVideo: channelData.currentVideo!,
                        paused: channelData.paused!,
                        progress: channelData.progress!,
                        private: channelData.private!,
                        password: channelData.password!,
                        followerOnlyChat: channelData.followerOnlyChat!,
                        live: channelData.live!
                    }

                    if (!_.isEqual(oldData, msg.data)) {
                        setChannelData(msg.data as RealtimeChannelData );
                    }
                    break;
                }
            }
        }

        setRequests([
            ...requests,
            ...newRequests
        ].filter(v => removedRequests.find(removed => isRequestsEqual(v, removed)) == null));
    }, [channelData, messageHistory, prevSocketMessages, requests, socketMessagesChanged])

    const value = useMemo(() => {
        const createRequest = (request: Request) => {
            sendJsonMessage({
                type: 'CHANNEL_REQUEST_ADD',
                data: request
            });
        }

        const removeRequest = (request: Request) => {
            sendJsonMessage({
                type: 'CHANNEL_REQUEST_REMOVE',
                data: request
            });
        }

        const getRequests = (roomId: string) => {
            sendJsonMessage({
                type: 'CHANNEL_REQUESTS_GET',
                data: roomId
            });
        }

        const requestChannelData = (roomId: string) => {
            sendJsonMessage({
                type: 'CHANNEL_GET',
                data: roomId
            });
        }

        const updateRealtimeChannelData = (updatedChannelData: Partial<RealtimeChannelData> & { channelId: string }) => {
            sendJsonMessage({
                type: 'CHANNEL_UPDATE',
                data: {
                    ...updatedChannelData  
                }
            });
        }
        return { createRequest, removeRequest, updateRealtimeChannelData, requests, getRequests, channelData, requestChannelData};
    }, [channelData, requests, sendJsonMessage]);

    return (
        <ChannelContext.Provider value={value}>
            {children}
        </ChannelContext.Provider>
    );
}

export const useChannel = () => {
    return useContext(ChannelContext);
}