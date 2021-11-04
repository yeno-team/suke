import React, { useContext, useEffect, useMemo, useState } from "react";
import { SocketMessage, SocketMessageInput, SocketMessageType } from "@suke/suke-core/src/entities/SocketMessage";

const ws = new WebSocket("ws://" + process.env.REACT_APP_SERVER_URL as string);

export type MessageListener = (message: SocketMessage) => void;

export interface SocketContextInterface {
    errors: Error[];
    send: (message: SocketMessageInput) => void;
    on: (event: SocketMessageType, callbackFunc: MessageListener) => void;
}

export type MessageListeners = {
    [K in SocketMessageType]: MessageListener[]
}

export const SocketContext = React.createContext<SocketContextInterface>({} as SocketContextInterface);

export const SocketContextProvider = ({children}: {children: React.ReactNode}): JSX.Element => {
    const [errors, setErrors] = useState<Error[]>([]);
    const [messageListeners, setMessageListeners] = useState<MessageListeners>({} as MessageListeners);
    
    useEffect(() => {
        ws.onopen = () => {
            console.log("Successfully connected to Socket Server.");
        }  

        ws.onclose = () => {
            console.warn("Disconnected from the Socket Server.");
        }

        ws.onerror = (err) => {
            console.error("WebSocket Error: " + err);
        }
    }, []);

    // Listen to on message and call any handlers set by clients
    useEffect(() => {
        ws.onmessage = (msg) => {
            try {
                const data = msg.data;
                const msgObj = new SocketMessage(data);

                if (messageListeners == null)
                    return;

                const listeners = messageListeners[msgObj.type];

                if (listeners == null)
                    return;

                for (const handler of listeners) {
                    handler(msgObj);
                }
            } catch (e) {
                setErrors(errors => [...errors, e as Error]);
            }
        }
        
    }, [messageListeners])

    const memoedValue = useMemo(() => {
        const send = (message: SocketMessageInput) => {
            ws.send(JSON.stringify(message));
        }
    
        const on = (event: SocketMessageType, cb: MessageListener) => {
            setMessageListeners(prevListeners => ({
                ...prevListeners,
                [event]: cb
            }));
        }

        return {
            errors, send, on
        }
    }, [errors])

    return (
        <SocketContext.Provider value={memoedValue}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    return useContext(SocketContext);
}