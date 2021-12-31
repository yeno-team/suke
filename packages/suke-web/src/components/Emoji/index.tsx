import React from "react";
import classNames from "classnames";

export interface EmojiProps {
    url : string,
    name : string,
    height? : number,
    width? : number
    className? : string
}

export const Emoji = ({ url , name , height = 32 , width = 32 , className } : EmojiProps) : JSX.Element => {
    return (
        <img 
            src={url} 
            alt={name} 
            height={height} 
            width={width}
            className={
                classNames(
                    className,
                    "cursor-pointer"
                )
            }
        />
    )
}