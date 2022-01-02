import React,  { useState , useMemo } from 'react';
import  { Icon } from "@iconify/react";
import { Messages } from './Messages';
import { IUser } from '@suke/suke-core/src/entities/User';
import classNames from 'classnames';
import TextAreaAutoResize from "react-textarea-autosize";
import { useGlobalEmoji } from "@suke/suke-web/src/hooks/useGlobalEmoji";
import { EmotePanel } from './ChatPanel';
import './Chat.css';
import { IReceivedMessage } from '@suke/suke-core/src/entities/ReceivedMessage';
import { ISentMessage } from '@suke/suke-core/src/entities/SentMessage';
export interface ChatProps {
    className?: string;
    messages: IReceivedMessage[];
    channelId: string | undefined;
    hasUserJoinedRoom : boolean;
    doesChannelExist : boolean;
    submitMessage: (message: ISentMessage) => void;
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
    const [ globalEmotes , hasGlobalEmotesBeenFetched ] = useGlobalEmoji(); 
    const [ messageInput, setMessageInput ] = useState("");
    const [ isChatPanelActive , setIsChatPanelActive ] = useState(false);

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

    const toggleChatPanel = () => {
        if(!(isUserAbleToChat)) {
            return
        }

        setIsChatPanelActive((prevState) => !(prevState))
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
                        className="relative p-3 rounded-l-md text-sm md:text-base focus:outline-none text-white resize-none overflow-hidden bg-transparent flex-1 h-auto" 
                        maxLength={500} placeholder="Send a message..." 
                        onKeyDown={handleSubmitByEnter}
                        disabled={!isUserAbleToChat}
                    />
                    { 
                        globalEmotes.length <= 0 ? 
                        <Icon icon="mdi:emoticon" className="h-32 w-32 cursor-pointer text-white transform-gpu transition-transform hover:scale-125" onClick={toggleChatPanel}/> : 
                        <img src={globalEmotes[0].url} alt="hi" height={32} width={32} className="cursor-pointer transform-gpu hover:scale-125" onClick={toggleChatPanel}/>
                    }
                    {isChatPanelActive && <EmotePanel setChatPanelVisiblity={setIsChatPanelActive} globalEmotes={globalEmotes} setMessageInput={setMessageInput}/>}
                </div>
            </div>
        </div>
    )
}