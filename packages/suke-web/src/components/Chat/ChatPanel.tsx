import React , { useState , useMemo } from "react";
import { Emoji } from "@suke/suke-core/src/types/Emoji";
import Input from "@suke/suke-web/src/components/Input";
import classNames from "classnames";
import { Icon } from "@iconify/react";

export interface ChatPanelProps {
    globalEmotes : Emoji[]
}

export const ChatPanel = ({ globalEmotes } : ChatPanelProps ) : JSX.Element => {
    const [ searchInput , setSearchInput ] = useState("")    
    const [ placeholder , setPlaceHolder ] = useState("")
    const [ emotePreview , setEmotePreview ] = useState<Emoji>()

    const globalEmoteComponents = useMemo(() => {
        return globalEmotes.map((emote) => 
        <div 
            key={emote.id}
            className="p-0.5 hover:bg-coolblack rounded cursor-pointer"
            style={{ height : "32px" , width : "32px" }}
            onMouseOver={() => {
                setPlaceHolder(emote.name)
                setEmotePreview(emote)
            }}
        >
            <img src={emote.url} alt={emote.name}/>
        </div>
    )
    } , [globalEmotes])

    return (
        <div className={classNames(
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
        )}>
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
                className="flex-1 overflow-y-scroll scroll-smooth flex flex-wrap p-1 items-center justify-center gap-2" 
                style={{ "scrollbarWidth" : "thin" , "scrollbarColor" : "#252B3A #0000"}}
            >
                {globalEmoteComponents}
            </div>
                { emotePreview && 
                    <div className="bg-black rounded-b-md p-2 flex items-center"> 
                        <img src={emotePreview.url} alt={emotePreview.name} width={32} height={32}/>
                        <div className="text-sm text-white ml-2">
                            <p> {emotePreview.name} </p>
                            <p> This is a global emote </p>
                        </div>
                    </div>
                }
        </div>
    )
} 