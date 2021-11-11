import { IMessage, Message } from "@suke/suke-core/src/entities/Message";
import { SocketMessage } from "@suke/suke-core/src/entities/SocketMessage";
import { useEffect, useState } from "react";
import { useChanged } from "./useChanged";
import { usePrevious } from "./usePrevious";
import { useSocket } from "./useSocket";

export const useChat = (defaultMessages: IMessage[] = []) => {
    const [chatMessages, setChatMessages] = useState<IMessage[]>(defaultMessages);

    const { send, messages } = useSocket();
    const [ socketMessagesChanged, prevSocketMessages] = useChanged<SocketMessage[]>(messages);

    // TODO: test if the messages from server is correctly grabbed
    // TODO: a way to convert messatges to chat messages
    useEffect(() => {
        try {
            if (!socketMessagesChanged || prevSocketMessages == null)
                return;

            const newMessages = messages.slice(prevSocketMessages.length);
            const newChatMessages = newMessages.flatMap((v => v.type === 'CHAT_MESSAGE' ? new Message(v.data as IMessage) : []))

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


    function sendMessage(msg: IMessage) {
        send({
            type: "CHAT_MESSAGE",
            data: msg
        });
    }

    return [ chatMessages, sendMessage ] as const;
}