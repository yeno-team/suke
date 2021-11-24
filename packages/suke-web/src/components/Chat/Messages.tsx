import React , { useState , useEffect , useRef } from "react";
import { IMessage } from "@suke/suke-core/src/entities/Message";
import { Button } from "../Button";
import classNames from "classnames";
import { StringColor } from "../StringColor";
import { InlineIcon } from "@iconify/react";

export interface MessagesProps {
    className?: string;
    channelName : string;
    messages: IMessage[];
    replyHandler : (authorName : string) => void;
}

export const Messages = ({messages , channelName , className , replyHandler }: MessagesProps) => {
    // We can use the channel name to connect to the channel chat using websockets.

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
    } , [messages])

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
                <p className="px-1.5 py-0.5">Welcome to {channelName} chat room!</p>
                {
                    messages.map((msg , index)=> {
                        return (
                            <div key={index} className="group px-1.5 py-0.5 hover:bg-coolgray rounded relative">
                                <StringColor className="mr-1 cursor-pointer" baseString={msg.author.name} brightness={5} bold>{msg.author.name}: </StringColor> 
                                <span className="pl-1 whitespace-normal break-words text-indent-2">{msg.content}</span>
                                <Button className="group-hover:visible invisible absolute right-0 -top-3 rounded shadow-2xl" backgroundColor="darkgray" onClick={() => replyHandler(msg.author.name)}><InlineIcon icon="fa-reply" height={15} width={15}/></Button>
                            </div>
                        )
                    })
                }
            </div>
            <div className={classNames(
                "text-center",
                "w-2/4",
                "lg:w-2/5",
                "xl:w-1/6",
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
                "left-1/4",
                {"hidden" : !isToolTipVisible}
            )} onClick={onClickToolTipHandler}>
                <span> You are viewing older messages. </span>
            </div>
        </React.Fragment>
    )
}