import React , { useState , useMemo, useCallback } from "react";
import { Emoji as IEmoji } from "@suke/suke-core/src/types/Emoji";
import Input from "@suke/suke-web/src/components/Input";
import { Emoji , EmojiPlaceholder } from "@suke/suke-web/src/components/Emoji";
import LazyLoad from "react-lazyload";
import classNames from "classnames";
import { Icon } from "@iconify/react";

export interface ChatPanelProps {
    globalEmotes : IEmoji[];
    setChatPanelVisiblity :  React.Dispatch<React.SetStateAction<boolean>>;
    setMessageInput : React.Dispatch<React.SetStateAction<string>>;
}

export const EmojiPanel = ({ globalEmotes: globalEmojis , setChatPanelVisiblity , setMessageInput } : ChatPanelProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> ) : JSX.Element => {
    const [ searchInput , setSearchInput ] = useState("")    
    const [ placeholder , setPlaceHolder ] = useState("")
    const [ emotePreview , setEmotePreview ] = useState<IEmoji>()
    
    const emojiOnClickHandler = useCallback((emoteParsableStr : string) => {
        return () => {  
            setMessageInput((prevState) => prevState + `${emoteParsableStr}`)
            setChatPanelVisiblity(false)
        }
    } , [setChatPanelVisiblity , setMessageInput])

    const globalEmojiComponents = useMemo(() => {
        return globalEmojis.map((emoji) => 
            <LazyLoad overflow once placeholder={<EmojiPlaceholder/>}>
                <div 
                    key={emoji.id}
                    className="p-0.5 hover:bg-coolblack rounded cursor-pointer"
                    onMouseOver={() => {
                        setPlaceHolder(emoji.name)
                        setEmotePreview(emoji)
                    }}
                    onClick={emojiOnClickHandler(emoji.parseableStr)}
                >
                    <Emoji emoji={emoji} height={32} width={32} className="select-none"/>
                </div>
            </LazyLoad>
        )
    } , [emojiOnClickHandler, globalEmojis])

    return (
        <div 
            className={classNames(
                "bg-coolgray",
                "absolute",
                "-top-80",
                'right-0',
                "h-72",
                "w-full",
                "md:w-1/2",
                "lg:w-1/3",
                "xl:w-1/4",
                "flex",
                "flex-col",
                "rounded",
                "divide-y"
                )
            }
            tabIndex={1}
            onBlur={() => setChatPanelVisiblity(false)}
        >
            <nav className="p-1">
                <Input 
                    containerClassName="h-8 rounded-md"
                    inputClassName="text-sm"
                    inputPlaceholder={placeholder || "Search..."}
                    value={searchInput}
                    onChange={setSearchInput}
                    icon={<Icon icon="bi:search" className="h-4 w-4 text-gray"/>}
                />
            </nav>
            <div
                className="flex-1 overflow-y-scroll flex flex-wrap p-1 items-center justify-center gap-2" 
                style={{ "scrollbarWidth" : "thin" , "scrollbarColor" : "#252B3A #0000"}}
            >
                {globalEmojiComponents}
            </div>
                { emotePreview && 
                    <div className="bg-black rounded-b-md p-2 flex items-center"> 
                        <img src={emotePreview.url} alt={emotePreview.name} width={32} height={32}/>
                        <div className="text-sm text-white ml-2">
                            <p className="font-semibold"> {emotePreview.name} </p>
                            <p> { emotePreview.type === "global" ? "Global Emoji" : "Channel Emoji"} </p>
                        </div>
                    </div>
                }
        </div>
    )
} 