import React , { useState , useEffect , useRef } from "react";
import { IMessage } from "@suke/suke-core/src/entities/Message";
import classNames from "classnames";
import { StringColor } from "../StringColor";

export interface MessagesProps {
    className?: string;
    messages: IMessage[];
}

export const Messages = ({messages, className}: MessagesProps) => {
    const messagesContainer = useRef<HTMLDivElement>(null)
    const [isToolTipVisible , setIsToolTipVisible] = useState(false)
    const [isMessagesContainerFocused , setIsMessagesContainerFocused] = useState(false)

    const scrollMessagesToBottom = () => {
        const element = messagesContainer.current
        element!.scrollTop = element!.scrollHeight
    }
    
    // Checks if the user has completely scrolled all the way down in the element.
    const hasCompletedScroll = (element : HTMLElement) : boolean => {
        return (element!.scrollTop + element!.clientHeight >= element?.scrollHeight)
    }

    // Checks if an div element has a vertical scrollbar.
    const hasVerticalScrollbar = (element : HTMLDivElement) : boolean => {
        return element.scrollHeight > element.clientHeight
    }
    
    const onScrollHandler = (event : React.UIEvent) => {
        if(messagesContainer.current) {
            const element = messagesContainer.current

            if(!(hasCompletedScroll(element)) && !(isToolTipVisible)) {
                setIsToolTipVisible(true)
            } else if(hasCompletedScroll(element) && isToolTipVisible) {
                setIsToolTipVisible(false)
            }
        }
    }

    const onClickToolTipHandler = (event : React.MouseEvent) => {
        scrollMessagesToBottom()
        setIsToolTipVisible(false)
    }

    // Auto scroll when new messages appear. 
    useEffect(() => {
        if(messagesContainer.current) {
            const element = messagesContainer.current

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
                    "relative",
                    className
                )}
                
                tabIndex={0} // Attribute allows the div to be focused.
                onFocus={() => setIsMessagesContainerFocused(true)}
                onBlur={() => setIsMessagesContainerFocused(false)}
                onScroll={onScrollHandler}
                ref={messagesContainer}
            >
                <p className="text-base text-center"> Welcome to the Chat Room</p>
                {
                    messages.map((msg , index)=> {
                        return (
                            <div key={index}>
                                <StringColor className="mr-1" baseString={msg.author.name} brightness={5} bold>{msg.author.name}: </StringColor> 
                                <div className="pl-1 inline whitespace-normal break-words text-indent-2">{msg.content}</div>
                            </div>
                        )
                    })
                }
            </div>
            <div className={classNames(
                "text-center",
                "w-2/4",
                "h-auto",
                "whitespace-normal",
                "p-3",
                "cursor-pointer",
                "bg-white", 
                "bg-opacity-5",
                "font-semibold",
                "text-xs",
                "m-auto",
                "text-white",
                "rounded-xl",
                "absolute",
                "bottom-40",
                "ring-2",
                "ring-gray",
                "ring-opacity-30",
                "left-1/4",
                {"hidden" : !isToolTipVisible}
            )} onClick={onClickToolTipHandler}>
                <span> You are viewing older messages. </span>
            </div>
        </React.Fragment>
    )
}