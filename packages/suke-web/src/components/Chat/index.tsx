import { IMessage } from '@suke/suke-core/src/entities/Message';
import { Icon } from '@iconify/react';
import classNames from 'classnames';
import React, { useState } from 'react';
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
            <div className="flex m-auto w-full items-center justify-around p-5">
                <input value={messageInput} onChange={e => setMessageInput(e.target.value)} onKeyUp={(e) => handleSubmitOnKeyPress(e.key)} className="w-10/12 p-3 rounded-md text-sm md:text-base" placeholder="Send message..." type="text"></input>
                <button className="bg-blue p-3 rounded-full" onClick={handleSubmit}>
                    <Icon icon="fa-solid:paper-plane" height="16" width="16" color="white" inline={true}/>
                </button>
            </div>
        </div>
    )
}