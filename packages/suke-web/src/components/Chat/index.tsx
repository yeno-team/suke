import { IMessage } from '@suke/suke-core/src/entities/Message'
import React from 'react'
import { Box, Container, Form } from 'react-bulma-components'
import { Messages } from './Messages'
export interface ChatProps {
    messages: IMessage[];
    submitMessage: (message: IMessage) => void;
}

export const Chat = ({messages}: ChatProps) => {
    return (
        <div>
            <Container className="has-text-centered" >
                <Box py="small-1" textSize={5} textWeight="bold" justifyContent="center" textColor="white" backgroundColor="lightblack">CHAT</Box>
            </Container>
            <Container py="smaller1" backgroundColor="black" radiusless>
                <Messages messages={messages} />
                <Form.Textarea size="small" p="small"></Form.Textarea>
            </Container>
        </div>
    )
}