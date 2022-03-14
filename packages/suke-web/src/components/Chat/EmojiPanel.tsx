import React , { useState , useMemo, useCallback } from "react";
import { Emoji } from "@suke/suke-core/src/types/Emoji";
import Input from "@suke/suke-web/src/components/Input";
import { Emoji as EmojiComponent , EmojiPlaceholder } from "@suke/suke-web/src/components/Emoji";
import LazyLoad from "react-lazyload";
import classNames from "classnames";
import { Icon } from "@iconify/react";

export interface ChatPanelProps {
    globalEmotes : Emoji[];
    setChatPanelVisiblity :  React.Dispatch<React.SetStateAction<boolean>>;
    appendMessageInput : (val: string) => void;
    isUserGuest: boolean;
}

export const EmojiPanel = ({ globalEmotes: globalEmojis, setChatPanelVisiblity , appendMessageInput, isUserGuest } : ChatPanelProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> ) : JSX.Element => {
    const [ searchInput , setSearchInput ] = useState("");   
    const [ placeholder , setPlaceHolder ] = useState("");
    const [ emotePreview , setEmotePreview ] = useState<Emoji>();
    
    const emojiOnClickHandler = useCallback((name: string) => {
        return () => {  
            if (!isUserGuest) {
                appendMessageInput(`${name}`);
            }
            
            setChatPanelVisiblity(false)
        }
    } , [isUserGuest, setChatPanelVisiblity, appendMessageInput]);

    const filteredEmojiComponents = useMemo(() => {
        const getEmoteComponents = (emojis: Emoji[]) => {
            return emojis?.map((emoji, index) => (
                <LazyLoad once placeholder={<EmojiPlaceholder/>} key={emoji.url}>
                    <div 
                        className="p-0.5 hover:bg-coolblack rounded cursor-pointer"
                        onMouseOver={() => {
                            setPlaceHolder(emoji.name)
                            setEmotePreview(emoji)
                        }}
                        onClick={emojiOnClickHandler(emoji.name)}
                    >
                        <EmojiComponent emoji={emoji} height={32} width={32}/>
                    </div>
                </LazyLoad>
            ));
        }

        return (
            searchInput === "" ?
            getEmoteComponents(globalEmojis) :
            getEmoteComponents(globalEmojis.filter((v, i) => globalEmojis[i].name.indexOf(searchInput) !== -1))
        );
    } , [emojiOnClickHandler, globalEmojis, searchInput])

    return (
        <div 
            className={classNames(
                "bg-black",
                "absolute",
                "-top-80",
                'right-0',
                "h-72",
                "w-full",
                "flex",
                "flex-col",
                "rounded",
                "divide-y"
                )
            }
            tabIndex={1}
            // onBlur={() => setChatPanelVisiblity(false)}
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
                className="flex-1 overflow-y-scroll flex flex-wrap p-1 gap-2" 
                style={{ "scrollbarWidth" : "thin" , "scrollbarColor" : "#252B3A #0000"}}
            >
                {filteredEmojiComponents}
            </div>
                { emotePreview && 
                    <div className="bg-black rounded-b-md p-2 flex items-center"> 
                        <EmojiComponent emoji={emotePreview} height={32} width={32}/>
                        <div className="text-sm text-white ml-2">
                            <p className="font-semibold"> {emotePreview.name} </p>
                            <p> { emotePreview.type === "global" ? "Global Emoji" : "Channel Emoji"} </p>
                        </div>
                    </div>
                }
        </div>
    )
} 