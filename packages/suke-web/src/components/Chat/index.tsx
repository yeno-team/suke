import { IMessage } from '@suke/suke-core/src/entities/Message'
import React from 'react';
import './Chat.scss';
import { Messages } from './Messages';

export interface ChatProps {
    messages: IMessage[];
    submitMessage: (message: IMessage) => void;
}

export const Chat = ({messages}: ChatProps) => {
    return (
        <div></div>
    )
}