import { EmojiAsStr } from "@suke/suke-core/src/types/Emoji";
import classNames from "classnames";

export interface EmojiProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    emoji : EmojiAsStr,
    height? : number,
    isSelectable? : boolean;
    width? : number
    className? : string,
}

export const Emoji = ({ emoji , height , width , className , isSelectable } : EmojiProps) : JSX.Element => {
    return (
        <img 
            src={emoji.url} 
            alt={isSelectable ? "" : ""}
            height={height} 
            width={width}
            onDragStart={(e) => e.preventDefault()}
            className={
                classNames(
                    className,
                    "cursor-pointer",
                    {
                        "select-none" : !(isSelectable)
                    }
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