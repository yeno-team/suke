import React from "react";
import { Meta , Story } from "@storybook/react";
import { Button, ButtonProps } from "../components/Button";

export default {
    title : "Components/Button",
    component : Button
} as Meta;

const Template : Story<ButtonProps> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    size : 10,
    children : "123",
    onClick : () => console.log("hello world")
}