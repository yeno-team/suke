import { IReceivedMessage , ReceivedMessage } from "@suke/suke-core/src/entities/ReceivedMessage";
import { ISentMessage } from "@suke/suke-core/src/entities/SentMessage";
import { SocketMessageInput } from "@suke/suke-core/src/entities/SocketMessage";
import React, { useEffect, useState } from "react";
import { useChanged } from "./useChanged";
import { useSocket } from "./useSocket";

export const useChat = (defaultMessages: IReceivedMessage[] = []) => {
    const [chatMessages, setChatMessages] = useState<IReceivedMessage[]>(defaultMessages);
    const { sendJsonMessage, messageHistory } = useSocket();
    const [ socketMessagesChanged, prevSocketMessages] = useChanged<SocketMessageInput[]>(messageHistory);
   
    useEffect(() => {
        try {
            if (!socketMessagesChanged || prevSocketMessages == null)
                return;

            const newMessages = messageHistory.slice(prevSocketMessages.length);
            const newChatMessages = newMessages.flatMap((v => v.type === "RECEIVED_CHAT_MESSAGE" ? new ReceivedMessage(v.data as ReceivedMessage) : []))

            setChatMessages(chatMessages => [
                ...chatMessages,
                ...newChatMessages
            ]);

        } catch (e) {
            console.error(e);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatMessages, socketMessagesChanged])


    function sendMessage(msg: ISentMessage) {
        sendJsonMessage({
            type: "SENT_CHAT_MESSAGE",
            data: msg
        });
    }

    return [ chatMessages, sendMessage ] as const;
}