import React , { useState , useEffect , useRef , useMemo } from "react";
import { Button } from "../Button";
import classNames from "classnames";
import { StringColor } from "../StringColor";
import { InlineIcon } from "@iconify/react";
import { IReceivedMessage } from "@suke/suke-core/src/entities/ReceivedMessage";
import { parseMessage } from "@suke/suke-web/src/util/parseMessage";
import { Emoji } from "@suke/suke-core/src/types/Emoji";

export interface MessagesProps {
    className?: string;
    channelId: string | undefined;
    messages: IReceivedMessage[];
    emojis : Array<Emoji>;
    replyHandler : (authorName : string) => void;
    title?: string,
    doesChannelExist : boolean
}

export const Messages = ({messages , channelId , className , replyHandler , doesChannelExist , emojis, title = `Welcome to ${channelId} chat room!`}: MessagesProps) => {
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const [isToolTipVisible , setIsToolTipVisible] = useState(false)
    const [isMessagesContainerFocused , setIsMessagesContainerFocused] = useState(false)

    const scrollMessagesToBottom = () => {
        const element = messagesContainerRef.current
        element!.scrollTop = element!.scrollHeight
    }
    
    // Checks if the user has completely scrolled all the way down in the element.
    const hasCompletedScroll = (element : HTMLElement) : boolean => {
        return (element!.scrollTop + element!.clientHeight >= element!.scrollHeight)
    }

    // Checks if an div element has a vertical scrollbar.
    const hasVerticalScrollbar = (element : HTMLDivElement) : boolean => {
        return element.scrollHeight > element.clientHeight
    }
    
    const onScrollHandler = () => {
        if(messagesContainerRef.current) {
            const element = messagesContainerRef.current

            if(!(hasCompletedScroll(element)) && !(isToolTipVisible)) {
                setIsToolTipVisible(true)
            } else if(hasCompletedScroll(element) && isToolTipVisible) {
                setIsToolTipVisible(false)
                setIsMessagesContainerFocused(false)
            }
        }
    }

    const onClickToolTipHandler = () => {
        scrollMessagesToBottom()
        setIsToolTipVisible(false)
    }

    // Auto scroll when new messages appear. 
    useEffect(() => {
        if(messagesContainerRef.current) {
            const element = messagesContainerRef.current

            // If the user has not scrolled all the way down to the max, is not focused on the message container and the tooltip is not visible.
            if(!(hasCompletedScroll(element)) && !(isMessagesContainerFocused) && !(isToolTipVisible)) {
                scrollMessagesToBottom()
            } else if(!hasCompletedScroll(element) && (isMessagesContainerFocused) && hasVerticalScrollbar(element) && !(isToolTipVisible)) {
                // If the user has not scrolled at the way down to the max and the tooltip is not visible. 
                // But if the message container is focused make the tooltip visible.
                setIsToolTipVisible(true)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    } , [messages])

    const parsedMessages = useMemo(() => {
        return messages.map((message , index) => {
            const emoteRegex = /:([a-zA-Z]*):/g;

            const parsedMessage = parseMessage(
                emojis, 
                message.content.replaceAll(emoteRegex, (match) => {
                    const foundEmote = emojis.find(v => v.name === match);
                    if (foundEmote == null) return match;
                    return `<@${foundEmote.id}:${foundEmote.type}/>`;
                })
            );

            return (
                <div key={index} className="group px-1.5 py-0.5 hover:bg-coolgray rounded relative flex flex-row items-center flex-wrap">
                    <StringColor className="mr-1 cursor-pointer" baseString={message.author.name} brightness={5} bold>{message.author.name}: </StringColor> 
                    <div className="whitespace-normal break-words ml-2 flex flex-row flex-wrap items-center">{parsedMessage}</div>
                    <Button className="group-hover:visible invisible absolute right-0 -top-3 rounded shadow-2xl" backgroundColor="darkgray" onClick={() => replyHandler(message.author.name)}>
                        <InlineIcon icon="fa-reply" height={15} width={15}/>
                    </Button>
                </div>
            )
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    } , [ messages ])

    return (
        <React.Fragment>
            <div 
                className={classNames(
                    'overflow-auto',
                    'overflow-x-hidden',
                    'whitespace-nowrap',
                    className
                )}
                style={{ "scrollbarWidth" : "thin" , "scrollbarColor" : "#5E6668 #171A1F"}}
                tabIndex={0} // Attribute allows the div to be focused.
                onFocus={() => setIsMessagesContainerFocused(true)}
                onBlur={() => setIsMessagesContainerFocused(false)}
                onScroll={onScrollHandler}
                ref={messagesContainerRef}
            >
                <p className="px-1.5 py-0.5">
                    {
                        (channelId && doesChannelExist) ? 
                        title :
                        "This chat room does not exist or has been suspended."
                    }
                </p>
                {parsedMessages}
            </div>
            <div className={classNames(
                "text-center",
                "w-2/4",
                "lg:w-2/5",
                "xl:w-2/6",
                "2xl:w-1/3",
                "h-auto",
                "whitespace-normal",
                "p-3",
                "cursor-pointer",
                "bg-darkgray",
                "font-semibold",
                "text-xs",
                "m-auto",
                "text-white",
                "rounded-md",
                "shadow-2xl",
                "absolute",
                "bottom-20",
                "transform",
                "-translate-x-1/2",
                "-translate-y-1/2",
                "left-1/2",
                {"hidden" : !isToolTipVisible}
            )} onClick={onClickToolTipHandler}>
                <span> You are viewing older messages. </span>
            </div>
        </React.Fragment>
    )
}