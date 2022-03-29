import { SocketMessage, SocketMessageInput, SocketMessageType } from "@suke/suke-core/src/entities/SocketMessage";
import React, { useContext, useRef } from "react";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import apiUrl from "../util/apiUrl";

export type MessageListener = (message: SocketMessage) => void;

export interface SocketContextInterface {
    sendJsonMessage: (message: SocketMessageInput) => void;
    messageHistory: SocketMessageInput[];
    setReconnectCallback: (callback: (closeEvent: CloseEvent) => void) => void;
}

export type MessageListeners = {
    [K in SocketMessageType]: MessageListener[]
}

export const SocketContext = React.createContext<SocketContextInterface>({} as SocketContextInterface);

// A wrapper around react-use-websocket package
export const SocketContextProvider = ({children}: {children: React.ReactNode}): JSX.Element => {
    const [reconnectCallback, setReconnectCallback] = useState<(closeEvent: CloseEvent) => void>();
    const reconnectCallbackRef = useRef<(closeEvent: CloseEvent) => void>();
    reconnectCallbackRef.current = reconnectCallback;
    const url = apiUrl("/api/socket");
    const resp = useWebSocket("ws://" + url.hostname + ":" + url.port + url.pathname, {
        onOpen: () => console.log('Connected to WebSocket.'),
        onError: (err) => {},
        shouldReconnect: (closeEvent) => {
            if (reconnectCallbackRef.current != null) {
                reconnectCallbackRef.current(closeEvent);
            }
            
            return true;
        }
    });

    
    const [messageHistory, setMessageHistory] = useState<SocketMessageInput[]>([]);
    
    useEffect(() => {
        if (resp.lastJsonMessage !== null) {
            setMessageHistory(prev => prev.concat(resp.lastJsonMessage))
        }
    }, [resp.lastJsonMessage]);
    return (
        <SocketContext.Provider value={{messageHistory: messageHistory, sendJsonMessage: resp.sendJsonMessage, setReconnectCallback: (callback) => { setReconnectCallback(callback) }}}>
            {children}
        </SocketContext.Provider>
    );
}

export const useSocket = () => {
    return useContext(SocketContext);
}