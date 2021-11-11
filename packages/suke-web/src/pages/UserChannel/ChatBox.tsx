import { IMessage } from "@suke/suke-core/src/entities/Message"
import { Chat } from "../../components/Chat";
import { useChat } from "../../hooks/useChat";


export const ChatBox = () => {

    const defaultMessages: IMessage[] = [
        {
            content: 'hello',
            author: {
                id: 1,
                name: 'hello'
            }
        },
        {
            content: 'hi',
            author: {
                id: 1,
                name: 'khai2'
            }
        },
        {
            content: 'bye',
            author: {
                id: 1,
                name: 'man'
            }
        }
    ]

    const [chatMessages, sendMessage] = useChat(defaultMessages);

    
    return (
        <Chat className="flex-grow" messages={chatMessages} submitMessage={sendMessage}/>
    )
}