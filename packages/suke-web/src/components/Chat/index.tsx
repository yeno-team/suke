import React,  { useState , useMemo , useEffect } from 'react';
import { IMessage } from '@suke/suke-core/src/entities/Message';
import  { Icon } from "@iconify/react";
import { Messages } from './Messages';
import { IUser } from '@suke/suke-core/src/entities/User';
import classNames from 'classnames';
import TextAreaAutoResize from "react-textarea-autosize";
import { useGlobalEmote } from "@suke/suke-web/src/hooks/useGlobalEmote";
import { ChatPanel } from './ChatPanel';
import './Chat.css';
export interface ChatProps {
    className?: string;
    messages: IMessage[];
    channelId: string | undefined;
    hasUserJoinedRoom : boolean;
    doesChannelExist : boolean;
    submitMessage: (message: IMessage) => void;
    user : IUser | undefined;
}

export const Chat = (
    {
        messages, 
        submitMessage, 
        className, 
        channelId , 
        user,
        hasUserJoinedRoom,
        doesChannelExist
    } : ChatProps
) => {
    const [ globalEmotes , hasGlobalEmotesBeenFetched ] = useGlobalEmote(); 
    const [ messageInput, setMessageInput ] = useState("");
    const [ isChatPanelActive , setIsChatPanelActive ] = useState(true);

    const isUserAbleToChat = useMemo(() => {
        return doesChannelExist && hasGlobalEmotesBeenFetched && hasUserJoinedRoom && channelId
    } , [ doesChannelExist , hasGlobalEmotesBeenFetched , hasUserJoinedRoom , channelId ])
    

    const handleSubmit = () => {
        if(user && channelId) { 
            submitMessage({
                content: messageInput,
                author: {
                    id: user.id,
                    name: user.name
                },
                channelId : channelId
            })
        }

        setMessageInput("")
    }

    const handleSubmitByEnter = (e : React.KeyboardEvent) => {
        if(e.key === "Enter" && !(e.shiftKey)) {
            e.preventDefault()
            handleSubmit()
        }
    }

    // Handles the logic when the client wants to reply to a user in the chat.
    const replyHandler = (authorName : string) : void => {
        setMessageInput(`${messageInput} @${authorName} `)
    }

    return (
        <div className={classNames(
            className
        )}>
            <header className="text-white text-lg tracking-wide text-center p-4 bg-black font-semibold">
                Chat
            </header>
            <Messages className="text-white p-4 flex-1 text-sm xl:text-base overflow-y-scroll" messages={messages} channelId={channelId} replyHandler={replyHandler} doesChannelExist={doesChannelExist}/>
           <div className="p-5">
                <div className="w-full rounded-md flex items-center bg-coolgray rounded-md pr-5 relative">
                    {
                        (!isUserAbleToChat) &&
                            <div className="absolute text-white -top-8 w-full px-4 py-2 text-sm bg-black flex items-center rounded"> 
                            <Icon icon="eos-icons:loading" className="h-5 w-5 inline"/>
                            <span className="ml-2"> Connecting to Chat... </span> 
                        </div>
                    }
                    <TextAreaAutoResize 
                        value={messageInput} maxRows={3} 
                        onChange={e => setMessageInput(e.target.value)} 
                        className="relative p-3 rounded-l-md text-sm md:text-base focus:outline-none text-white resize-none overflow-hidden bg-transparent flex-1 h-auto " 
                        maxLength={500} placeholder="Send a message..." 
                        onKeyDown={handleSubmitByEnter}
                        disabled={!isUserAbleToChat}
                    />
                    <div
                        style={{
                            backgroundImage : `url("/asset/global.png")`,
                            height : "32px",
                            width : "32px"
                        }}
                        className="cursor-pointer"
                        onClick={() => setIsChatPanelActive((prevState) => !prevState)}
                    >      
                    </div>
                    {isChatPanelActive && <ChatPanel globalEmotes={globalEmotes}/>}
                </div>
            </div>
        </div>
    )
}

/**
 *     // const globalEmotesComponents = useMemo(() => {
    //     return globalEmotes.map(({ emote , position }) => 
    //         <div 
    //             key={emote.url}
    //             style={{
    //                 backgroundImage : `url("/asset/global.png")`,
    //                 backgroundPositionY : `${position.y}px`,
    //                 backgroundPositionX : `${position.x}px`,
    //             }}
    //             className={
    //                 classNames(
    //                     "cursor-pointer",
    //                     "h-[32px]",
    //                     "w-[32px]",
    //                     "filter",
    //                     "grayscale",
    //                     "transform-gpu",
    //                     "hover:scale-[1.15]"
    //                 )
    //             }
    //         />
    //     )
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // } , [globalEmotes])
 */