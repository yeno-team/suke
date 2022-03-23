
import { IUserChannel } from "@suke/suke-core/src/entities/UserChannel/UserChannel";
import classNames from "classnames";
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { followChannel, getChannel, unfollowChannel } from "../../api/channel";
import { Navigation } from "../../common/Navigation"
import { VideoMenu } from "./VideoMenu";
import useAuth from "../../hooks/useAuth";
import { useRoom } from "../../hooks/useRoom";
import { BrowserModal } from "./BrowserModal";
import { ChatBox } from "../../components/ChatBox";
import { Profile } from "../../components/Profile";
import "./UserChannel.css";
import { defaultNotificationOpts, useNotification } from "../../hooks/useNotifications";
import { useChannel } from "../../hooks/useChannel";
import { ChannelSettingsBrowserModal } from "./ChannelSettingsModal";
import { useScreenSize } from "@suke/suke-web/src/hooks/useScreenSize";
import { PasswordPage } from "./PasswordPage";
import { useChanged } from "@suke/suke-web/src/hooks/useChanged";
import { useSocket } from "@suke/suke-web/src/hooks/useSocket";
import { SocketMessageInput } from "@suke/suke-core/src/entities/SocketMessage";

type UserChannelPageParams = {
    username: string
}

export const UserChannelPage = (): JSX.Element => {
    const [init, setInit] = useState(false);
    const [browserActive, setBrowserActive] = useState(false);
    const [settingsActive, setSettingsActive] = useState(false);
    const [channel, setChannel] = useState<(Omit<IUserChannel, 'followers'>) | null>();
    const [searching, setSearching] = useState(true);
    const [clientFollowed, setClientFollowed] = useState(false);
    const [joinedRoom, setJoinedRoom] = useState(false);
    const notifications = useNotification();
    const { username } = useParams<UserChannelPageParams>();
    const { joinChannelRoom } = useRoom();
    const { user, updateUser } = useAuth();
    const { channelData, requestChannelData, updateRealtimeRoomData } = useChannel();
    const { messageHistory, setReconnectCallback } = useSocket();
    const [ socketMessagesChanged, prevSocketMessages] = useChanged<SocketMessageInput[]>(messageHistory);
    const notificationStore = useNotification();
    const screen = useScreenSize();
    
    const isOwner = user ? user.name === username : false;
    
    useEffect(() => {
        const sendGetChannel = async () => {
            try {
                setSearching(true);
                const channelResp = await getChannel(username!);
                setChannel(channelResp);
            } catch (e) {
                console.warn(e);
            } finally { 
                setSearching(false);
            }
        }
        sendGetChannel();
        requestChannelData(username!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    useEffect(() => {
        try {
            if (!socketMessagesChanged || prevSocketMessages == null)
                return;

            const newMessages = messageHistory.slice(prevSocketMessages.length);
            
            for (const msg of newMessages) {
                switch(msg.type) {
                    case "CLIENT_ERROR":
                        notificationStore.addNotification({
                            ...defaultNotificationOpts,
                            type: "danger",
                            title: "Client Error",
                            message: msg.data
                        });
                        break;
                    case "SERVER_ERROR":
                        notificationStore.addNotification({
                            ...defaultNotificationOpts,
                            type: "danger",
                            title: "Server Error",
                            message: msg.data
                        });
                    break;
                }
            }

        } catch (e) {
            console.error(e);
        } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socketMessagesChanged])
    
    const toggleBrowserActive = () => {
        setBrowserActive(!browserActive);
    }

    const toggleSettingsActive = () => {
        setSettingsActive(!settingsActive);
    }

    const notifyError = (e: unknown) => {
        let message;
            
        if (typeof e === 'string') {
            message = e;
        } else {
            message = (e as Error)?.message;
        }

        if (message != null) {
            notifications.addNotification({
                ...defaultNotificationOpts,
                type : "danger",
                title : "Error",
                message
            });
        }
    }
    
    const handleFollow = async () => {
        try {
            await followChannel(username!);
            updateUser();
            setClientFollowed(true);
        } catch (e) {
            notifyError(e);
        }
    }

    const handleUnfollow = async () => {
        try {   
            await unfollowChannel(username!);
            setClientFollowed(false);
            updateUser();
        } catch (e) {
            notifyError(e);
        }
    }

    const handleBrowserOutsideClick = () => {
        if (browserActive) {
            setBrowserActive(false);
        }
    }

    const changeChannelThumbnail = (imageUrl: string) => {
        if (channelData.thumbnail.url === imageUrl) return;

        updateRealtimeRoomData({
            thumbnail: {
                url: imageUrl
            },
            channelId: username!
        });
    }
    useEffect(() => {
        const sendInitJoinRoom = () => {
            const roomIsPrivateWithPassword = !isOwner && channelData.private === true && channelData.password !== "";

            if (roomIsPrivateWithPassword) return;
        
            joinChannelRoom(username!);
            setJoinedRoom(true);
        }

        if (!init && Object.values(channelData).length > 0) {
            setInit(true);
            requestChannelData(username!);
            setReconnectCallback((closeEvent) => {
                console.log("RECONNECTING");
                setJoinedRoom(false);
                sendInitJoinRoom();
            })
        }
    }, [channelData, init, isOwner, joinChannelRoom, requestChannelData, setReconnectCallback, username]);


    const mobileClassListIfBrowserActive = browserActive ? "hidden lg:flex" : "block";
    const alreadyFollowed = user?.following?.find(v => v.followedTo?.id === channel?.id) != null || clientFollowed;

    const ChannelPage = joinedRoom ? 
    <div className="h-screen flex flex-col lg:block channel_elements lg:overflow-y-scroll lg:relative lg:mt-17 lg:mr-96">
        <BrowserModal roomId={username!} className="z-20 lg:w-20" active={browserActive} setActive={setBrowserActive} />
        <ChannelSettingsBrowserModal roomId={username!} className="z-20" active={settingsActive} setActive={setSettingsActive} />
        {
            channelData.live ?
            <VideoMenu channelData={channelData} ownerView={isOwner} className={classNames(mobileClassListIfBrowserActive, 'md:h-5/6', 'bg-darkblack')} handleOpenBrowser={toggleBrowserActive} handleOpenSettings={toggleSettingsActive} isAuthenticated={user?.id !== 0} channelId={username!} playerHeight={screen.isTablet || screen.isMobile ? "300px" : "91.2%"} viewerCount={channelData.viewerCount} setThumbnail={changeChannelThumbnail} /> :
            <div className="w-full bg-spaceblack h-6/20 flex justify-center items-center text-white">This channel is offline.</div>
        }
        <ChatBox channel="channel" className={classNames(mobileClassListIfBrowserActive, "lg:mt-24px lg:fixed lg:right-0 lg:top-17 lg:h-94p lg:w-96")} height={screen.isTablet || screen.isMobile ? "80" : "72"}  identifier={username as string} />
        <Profile pictureFileName={user?.pictureFilename} className={classNames(mobileClassListIfBrowserActive, "z-10 pb-24 lg:pb-96")} username={username as string} followerCount={channel?.followerCount ?? 0} followed={alreadyFollowed} handleFollow={handleFollow} handleUnfollow={handleUnfollow} description={channel ? {title: channel.desc_title  , content: channel.desc} : {title: "Loading", content: "Loading..."}}/>
    </div> : <PasswordPage active={!joinedRoom} channelId={username!} setJoinedRoom={setJoinedRoom} ></PasswordPage>

    return (
        <div>
            <div className={classNames("hidden fixed w-screen h-screen top-0 left-0 z-10 bg-opacity-70 bg-darkblack ", browserActive ? "lg:block" : "")} onClick={handleBrowserOutsideClick}></div>
            <Navigation className={classNames(mobileClassListIfBrowserActive, "lg:fixed z-10 lg:top-0")} />
            {
                 !searching && channel != null ? 
                 ChannelPage : 
                 <div className="h-screen flex flex-col lg:mt-17">
                     <div>Channel doesn't exist :(</div>
                 </div>
            }
        </div>
    )
}