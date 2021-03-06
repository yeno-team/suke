import React from "react";
import { Emoji as EmojiType } from "@suke/suke-core/src/types/Emoji";
import classNames from "classnames";
import { Image } from "../Image";
import apiUrl from "../../util/apiUrl";

export interface EmojiProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    emoji : EmojiType;
    height? : number;
    width? : number;
    className? : string,
}

export const Emoji = ({ emoji , height , width , className } : EmojiProps) : JSX.Element => {
    return (
        <Image 
            src={apiUrl("/api/proxy/" + emoji.url).toString()} 
            alt={""}
            height={height} 
            width={width}
            onDragStart={(e) => e.preventDefault()}
            className={
                classNames(
                    className,
                    "cursor-pointer",
                    "select-none"
                )
            }
        />
    )
}

export const EmojiPlaceholder = () : JSX.Element => {
    return (
        <div className="w-32 h-32 rounded-md animate-pulse bg-black"/>
    )
} 