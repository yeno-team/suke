import React,  { useState , useMemo } from 'react';
import  { Icon } from "@iconify/react";
import { Messages } from './Messages';
import { IUser } from '@suke/suke-core/src/entities/User';
import classNames from 'classnames';
import TextAreaAutoResize from "react-textarea-autosize";
import { useGlobalEmoji } from "@suke/suke-web/src/hooks/useGlobalEmoji";
import { EmojiPanel } from './EmojiPanel';
import './Chat.css';
import { IReceivedMessage } from '@suke/suke-core/src/entities/ReceivedMessage';
import { ISentMessage } from '@suke/suke-core/src/entities/SentMessage';
import { Emoji } from '@suke/suke-web/src/components/Emoji';

export interface ChatProps {
    className?: string;
    messages: IReceivedMessage[];
    channelId: string | undefined;
    hasUserJoinedRoom : boolean;
    doesChannelExist : boolean;
    submitMessage: (message: ISentMessage) => void;
    user : IUser | undefined;
    title?: string | undefined;
    channel: string;
    height?: string;
}

export const Chat = (
    {
        messages, 
        submitMessage, 
        className, 
        channelId , 
        user,
        hasUserJoinedRoom,
        doesChannelExist,
        height,
        title,
        channel
    } : ChatProps
) => {
    const [ globalEmoji , hasGlobalEmojiBeenFetched ] = useGlobalEmoji(); 
    const [ messageInput, setMessageInput ] = useState("");
    const [ isChatPanelActive , setIsChatPanelActive ] = useState(false);

    const isUserAbleToChat = useMemo(() => {
        return doesChannelExist && hasGlobalEmojiBeenFetched && hasUserJoinedRoom && channelId
    } , [ doesChannelExist , hasGlobalEmojiBeenFetched , hasUserJoinedRoom , channelId ])
    
    const isUserGuest = user!.id === 0;

    const toggleChatPanel = () => {
        if(!(isUserAbleToChat)) {
            return
        }

        setIsChatPanelActive((prevState) => !(prevState))
    }

    const chatEmojiIcon = useMemo(() => {
        if(!(isUserAbleToChat)) {
            return
        }

        if(globalEmoji.length <= 0) {
            return (
                <Icon icon="mdi:emoticon" className="h-32 w-32 cursor-pointer text-white transform-gpu transition-transform hover:scale-125" onClick={toggleChatPanel}/> 
            )
        }

        return (
            <div onClick={toggleChatPanel} className="cursor-pointer transform-gpu hover:scale-125 h-32 w-32">
                <Emoji emoji={globalEmoji[0]} className="h-full w-full"/>
            </div>
        )

    // eslint-disable-next-line react-hooks/exhaustive-deps
    } , [ isUserAbleToChat ])

    const handleSubmit = () => {
        if(user && channelId) { 
            submitMessage({
                content: messageInput,
                author: {
                    id: user.id,
                    name: user.name
                },
                channel,
                channelId : channelId
            });
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
            className,
            "lg:flex",
            "lg:flex-col"
        )}>
            <header className="w-full text-white text-lg tracking-wide text-center p-4 bg-black font-semibold">
                CHAT
            </header>
            <Messages className={classNames("text-white p-4 text-sm xl:text-base lg:flex-grow overflow-y-scroll bg-spaceblack", 'h-' + height)} messages={messages} channelId={channelId} replyHandler={replyHandler} doesChannelExist={doesChannelExist} emojis={globalEmoji} title={title}/>
            <div className="p-5 bg-spaceblack">
                <div className="w-full flex items-center bg-black rounded-md pr-5 relative">
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
                        className={classNames("relative p-3 rounded-l-md text-sm md:text-base focus:outline-none text-white resize-none overflow-hidden bg-transparent flex-1 h-auto", isUserGuest ? "cursor-not-allowed" : "")}
                        maxLength={500} placeholder={isUserGuest ? "Register for an account to chat!" : "Send a message..."}
                        onKeyDown={handleSubmitByEnter}
                        disabled={!isUserAbleToChat || isUserGuest}
                    />
                    {chatEmojiIcon}
                    {(isChatPanelActive && isUserAbleToChat) && <EmojiPanel setChatPanelVisiblity={setIsChatPanelActive} globalEmotes={globalEmoji} setMessageInput={setMessageInput} isUserGuest={isUserGuest}/>}
                </div>
            </div>
        </div>
    )
}