import { IMessage } from '@suke/suke-core/src/entities/Message';
import { Icon, InlineIcon } from '@iconify/react';
import classNames from 'classnames';
import React, { useState , useRef, useLayoutEffect } from 'react';
import { Messages } from './Messages';
import './Chat.css';

export interface ChatProps {
    className?: string;
    channelName : string;
    messages: IMessage[];
    submitMessage: (message: IMessage) => void;
}

export const Chat = ({messages, submitMessage, className , channelName }: ChatProps) => {
    const [messageInput, setMessageInput] = useState("");
    const serializeInputMessage = () : IMessage => {
        return {
            content : messageInput,
            author : {
                id : 1,
                name : "khai93"
            }
        }
    }

    const handleSubmit = () => {
        submitMessage(serializeInputMessage())
        setMessageInput("")
    }

    const handleSubmitOnKeyPress = (key : string) => {
        console.log(key)
        if(key !== "Enter") {
            return null
        }

        handleSubmit()
    }

    // Handles the logic when the client wants to reply to a user in the chat.
    const replyHandler = (authorName : string) : void => {
        setMessageInput(`${messageInput} @${authorName}`)
    }

    return (
        <div className={classNames(
            className
        )}>
            <header className="text-white text-lg tracking-wide text-center p-4 bg-black font-semibold">
                Chat
            </header>
            <Messages className="text-white p-4 flex-1 text-sm xl:text-base overflow-y-scroll" messages={messages} channelName="among us" replyHandler={replyHandler}/>
            <div className="p-5">
                <div className="w-full rounded-md flex items-center bg-coolgray rounded-md pr-5">
                    <textarea value={messageInput} onChange={e => setMessageInput(e.target.value)} onKeyUp={(e) => handleSubmitOnKeyPress(e.key)} className="p-3 rounded-l-md text-sm md:text-base focus:outline-none text-white resize-none overflow-hidden bg-transparent flex-1" maxLength={500} rows={1} placeholder="Send message..."/>
                    <Icon icon="fa-solid:sad-cry" className="text-white cursor-pointer" height={24} width={24}/>
                </div>
            </div>
        </div>
    )
}