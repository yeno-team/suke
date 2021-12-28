import React,  { useEffect, useMemo, useState } from 'react';
import { IMessage } from '@suke/suke-core/src/entities/Message';
import { Messages } from './Messages';
import { IUser } from '@suke/suke-core/src/entities/User';
import classNames from 'classnames';
import TextAreaAutoResize from "react-textarea-autosize";
import { useEmote } from "@suke/suke-web/src/hooks/useEmote";
import './Chat.css';
export interface ChatProps {
    className?: string;
    messages: IMessage[];
    channelId: string;
    submitMessage: (message: IMessage) => void;
    user : IUser | undefined;
}

export const Chat = ({messages, submitMessage, className , channelId , user } : ChatProps) => {
    const [ globalEmotes , channelEmotes ] = useEmote(channelId);
    const [ messageInput, setMessageInput ] = useState("");

    const globalEmotesComponents = useMemo(() => {
        return globalEmotes.map(({ emote , position }) => 
            <div 
                key={emote.url}
                style={{
                    backgroundImage : `url("/asset/global.png")`,
                    backgroundPositionY : `${position.y}px`,
                    backgroundPositionX : `${position.x}px`,
                }}
                className={
                    classNames(
                        "cursor-pointer",
                        "h-[32px]",
                        "w-[32px]",
                        "filter",
                        "grayscale",
                        "transform-gpu",
                        "hover:scale-125"
                    )
                }
            />
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    } , [globalEmotes])

    const handleSubmit = () => {
        if(user) { 
            submitMessage({
                content: messageInput,
                author: {
                    id: user.id,
                    name: user.name
                },
                channelId : channelId
            })
        }

        setMessageInput("")
    }

    const handleSubmitByEnter = (e : React.KeyboardEvent) => {
        if(e.key === "Enter" && !(e.shiftKey)) {
            e.preventDefault()
            handleSubmit()
        }
    }

    // Handles the logic when the client wants to reply to a user in the chat.
    const replyHandler = (authorName : string) : void => {
        setMessageInput(`${messageInput} @${authorName} `)
    }

    return (
        <div className={classNames(
            className
        )}>
            <header className="text-white text-lg tracking-wide text-center p-4 bg-black font-semibold">
                Chat
            </header>
            <Messages className="text-white p-4 flex-1 text-sm xl:text-base overflow-y-scroll" messages={messages} channelName={channelId} replyHandler={replyHandler}/>

            <div className="p-5">
                <div className="w-full rounded-md flex items-center bg-coolgray rounded-md pr-5">
                    <TextAreaAutoResize value={messageInput} maxRows={3} onChange={e => setMessageInput(e.target.value)} className="p-3 rounded-l-md text-sm md:text-base focus:outline-none text-white resize-none overflow-hidden bg-transparent flex-1 h-auto" maxLength={500} placeholder="Send a message..." onKeyDown={handleSubmitByEnter}/>
                    {globalEmotesComponents[0]}
                </div>
            </div>
        </div>
    )
}