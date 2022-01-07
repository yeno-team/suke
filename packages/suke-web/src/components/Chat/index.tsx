import { IMessage } from '@suke/suke-core/src/entities/Message'
import classNames from 'classnames';
import React, { useState } from 'react';
import { Messages } from './Messages';
import './Chat.css';
import useAuth from '../../hooks/useAuth';

export interface ChatProps {
    className?: string;
    messages: IMessage[];
    channelId: string;
    submitMessage: (message: IMessage) => void;
}

export const Chat = ({messages, submitMessage, className, channelId}: ChatProps) => {
    const [messageInput, setMessageInput] = useState("");
    const { user } = useAuth();

    const handleSubmit = () => {
        const msg: IMessage = {
            content: messageInput,
            author: {
                id: user!.id,
                name: user!.name
            },
            channelId: channelId
        }

        submitMessage(msg);
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
            <header className="w-full text-white text-lg tracking-wide text-center p-4 bg-newblack font-semibold">
                CHAT
            </header>
            <Messages className="text-white p-4 text-sm h-3/4" messages={messages} />
            <div className="flex m-auto w-full items-center justify-center mb-4">
                <input value={messageInput} onChange={e => setMessageInput(e.target.value)} className="w-3/4 p-3 rounded-tl rounded-bl text-sm" placeholder="Send message..." type="text"></input>
                <button onClick={handleSubmit} className="bg-teal rounded-tr text-sm  rounded-br px-2 py-3 mt-0 text-white w-14">Send</button>
            </div>
        </div>
    )
}