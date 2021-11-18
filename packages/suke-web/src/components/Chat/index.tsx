import { IMessage } from '@suke/suke-core/src/entities/Message';
import { Icon } from '@iconify/react';
import classNames from 'classnames';
import React, { KeyboardEventHandler, useState } from 'react';
import { Messages } from './Messages';
import './Chat.css';

export interface ChatProps {
    className?: string;
    messages: IMessage[];
    submitMessage: (message: IMessage) => void;
}

export const Chat = ({messages, submitMessage, className}: ChatProps) => {
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

    return (
        <div className={classNames(
            'flex',
            'bg-coolblack',
            'flex-col',
            'font-sans',
            'h-full',
            'overflow-auto',
            className
        )}>
            <header className="w-full text-white text-lg tracking-wide text-center p-4 bg-black font-semibold">
                Chat
            </header>
            <Messages className="text-white p-4 text-sm h-3/4" messages={messages} />
            <div className="flex m-auto w-full items-center justify-center mb-4">
                <input value={messageInput} onChange={e => setMessageInput(e.target.value)} onKeyUp={(e) => handleSubmitOnKeyPress(e.key)} className="w-3/4 p-3 rounded-full text-sm" placeholder="Send message..." type="text"></input>
                <button className="bg-blue p-3 rounded-full" onClick={handleSubmit}>
                    <Icon icon="fa-solid:paper-plane" height="16" width="16" color="white" inline={true}/>
                </button>
            </div>
        </div>
    )
}