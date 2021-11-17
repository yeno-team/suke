import { SocketMessage, SocketMessageInput, SocketMessageType } from "@suke/suke-core/src/entities/SocketMessage";
import React, { useContext, useEffect, useMemo, useState } from "react";

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
    }, []);

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