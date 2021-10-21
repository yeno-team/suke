import { IMessage } from "@suke/suke-core/src/entities/Message";
import React from "react";
import { Block, Box } from "react-bulma-components";
import { StringColor } from "../StringColor";

export interface MessagesProps {
    messages: IMessage[];
}

export const Messages = ({messages}: MessagesProps) => {
    return (
        <React.Fragment>
            {
                messages.map(msg => {
                    return (
                        <Block m="smaller2">
                            <StringColor baseString={msg.author.name} brightness={40} bold>{msg.author.name}: </StringColor> {msg.content}
                        </Block>
                    )
                })
            }
        </React.Fragment>
    )
}