import { Emoji as IEmoji } from "@suke/suke-core/src/types/Emoji";
import classNames from "classnames";

export interface EmojiProps {
    emoji : IEmoji,
    height : number,
    width : number
    className? : string
}

export const Emoji = ({ emoji , height , width , className } : EmojiProps) : JSX.Element => {
    return (
        <img 
            src={emoji.url} 
            alt={""}
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

export const EmojiPlaceholder = () : JSX.Element => {
    return (
        <div className="w-32 h-32 rounded-md animate-pulse bg-black"/>
    )
} 