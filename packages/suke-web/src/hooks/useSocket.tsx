import { SocketMessage, SocketMessageInput, SocketMessageType } from "@suke/suke-core/src/entities/SocketMessage";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { defaultNotificationOpts, useNotification } from "./useNotifications";

const ws = new WebSocket("ws://" + process.env.REACT_APP_SERVER_URL as string);

export type MessageListener = (message: SocketMessage) => void;

export interface SocketContextInterface {
    errors: Error[];
    send: (message: SocketMessageInput) => void;
    messages: SocketMessage[];
}

export type MessageListeners = {
    [K in SocketMessageType]: MessageListener[]
}

export const SocketContext = React.createContext<SocketContextInterface>({} as SocketContextInterface);
let pingTimeout: NodeJS.Timer;

export const SocketContextProvider = ({children}: {children: React.ReactNode}): JSX.Element => {
    const [messages, setMessages] = useState<SocketMessage[]>([])
    const [errors, setErrors] = useState<Error[]>([]);
    const notificationStore = useNotification();
    
    useEffect(() => {
        ws.onerror = (err) => {
            console.error("WebSocket Error: ", err);
        }

        ws.onopen = () => {
            console.log("Successfully connected to the Socket Server.");
        };

        ws.onmessage = (msg) => {
            try {
                const data = msg.data;

                const msgObj = new SocketMessage(JSON.parse(data.toString()));
                
                if (msgObj.type === 'CLIENT_ERROR') {
                    console.error("CLIENT_ERROR", msgObj.data);
                    if (msgObj.data) {
                        notificationStore.addNotification({
                            ...defaultNotificationOpts,
                            type : "danger",
                            title : "Error",
                            message : msgObj.data as string
                        });
                    }
                }

                if (msgObj.type === 'SERVER_ERROR') {
                    console.error("SERVER_ERROR", msgObj.data);
                    if (msgObj.data) {
                        notificationStore.addNotification({
                            ...defaultNotificationOpts,
                            type : "danger",
                            title : "Server Error",
                            message : msgObj.data as string
                        });
                    }
                }

                setMessages(messages => [
                    ...messages,
                    msgObj
                ]);
                
            } catch (e) {
                setErrors(errors => [...errors, e as Error]);
            }
        }

        ws.onclose = () =>{
            clearTimeout(pingTimeout);
        };
    }, [notificationStore]);

    const memoedValue = useMemo(() => {
        const send = (message: SocketMessageInput) => {
            ws.send(JSON.stringify(message));
        }

        return {
            errors, send, messages
        }
    }, [errors, messages])

    return (
        <SocketContext.Provider value={memoedValue}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    return useContext(SocketContext);
}