import { IMessage } from "@suke/suke-core/src/entities/Message";
import React from "react";
import { StringColor } from "../StringColor";

export interface MessagesProps {
    messages: IMessage[];
}

export const Messages = ({messages}: MessagesProps) => {
    return (
        <div>
            {
                messages.map(msg => {
                    return (
                        <div>
                            <StringColor baseString={msg.author.name} brightness={40} bold>{msg.author.name}: </StringColor> {msg.content}
                        </div>
                    )
                })
            }
        </div>
    )
}