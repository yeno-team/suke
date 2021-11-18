import { IMessage } from "@suke/suke-core/src/entities/Message";
import classNames from "classnames";
import React from "react";
import { StringColor } from "../StringColor";

export interface MessagesProps {
    className?: string;
    messages: IMessage[];
}

export const Messages = ({messages, className}: MessagesProps) => {
    return (
        <div className={classNames(
            'overflow-auto',
            'overflow-x-hidden',
            'whitespace-nowrap',
            className
        )}>
            {
                messages.map((msg , index)=> {
                    return (
                        <div key={index}>
                            <StringColor className="mr-1" baseString={msg.author.name} brightness={5} bold>{msg.author.name}: </StringColor> 
                            <div className="pl-1 inline whitespace-normal break-words text-indent-2">{msg.content}</div>
                        </div>
                    )
                })
            }
        </div>
    )
}