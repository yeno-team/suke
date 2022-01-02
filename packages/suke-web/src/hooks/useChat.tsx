import { IReceivedMessage , ReceivedMessage } from "@suke/suke-core/src/entities/ReceivedMessage";
import { ISentMessage } from "@suke/suke-core/src/entities/SentMessage";
import { SocketMessage } from "@suke/suke-core/src/entities/SocketMessage";
import { useEffect, useState } from "react";
import { useChanged } from "./useChanged";
import { useSocket } from "./useSocket";

export const useChat = (defaultMessages: IReceivedMessage[] = []) => {
    const [chatMessages, setChatMessages] = useState<IReceivedMessage[]>(defaultMessages);

    const { send, messages } = useSocket();
    const [ socketMessagesChanged, prevSocketMessages] = useChanged<SocketMessage[]>(messages);

    useEffect(() => {
        try {
            if (!socketMessagesChanged || prevSocketMessages == null)
                return;

            const newMessages = messages.slice(prevSocketMessages.length);
            const newChatMessages = newMessages.flatMap((v => v.type === "RECEIVED_CHAT_MESSAGE" ? new ReceivedMessage(v.data as ReceivedMessage) : []))

            setChatMessages(chatMessages => [
                ...chatMessages,
                ...newChatMessages
            ]);

        } catch (e) {
            console.error(e);
        } finally {
            console.log('Received Messages: ', chatMessages);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages, chatMessages, socketMessagesChanged])


    function sendMessage(msg: ISentMessage) {
        send({
            type: "SENT_CHAT_MESSAGE",
            data: msg
        });
    }

    return [ chatMessages, sendMessage ] as const;
}