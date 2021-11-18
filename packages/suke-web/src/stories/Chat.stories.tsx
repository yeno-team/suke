import { Meta, Story } from "@storybook/react";
import { Chat , ChatProps } from "../components/Chat";

export default {
    title : "Component/Chat",
    component : Chat,
    argTypes : {
        className : {
            description : "Define your own class names.",
            control : { type : "text" , required : false }
        },
        submitMessage : {
            onClick : {
                action : "clicked"
            },
            description : "A callback function that contains a user message as an argument."
        }
    }
} as Meta

const Template : Story<ChatProps> = (args) => <Chat {...args}/>

export const ActiveChat = Template.bind({})

ActiveChat.args = {
    messages : [
        {
            content : "I love eating ass.",
            author : {
                name : "Khai93",
                id : 123
            }
        },
        {
            content : "Khai eats ass.",
            author : {
                name : "Lunatite",
                id : 1
            }
        }
    ],
    submitMessage : (msg) => console.log(msg)
}

