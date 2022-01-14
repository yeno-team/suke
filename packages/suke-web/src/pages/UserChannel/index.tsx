
import { IUserChannel } from "@suke/suke-core/src/entities/UserChannel/UserChannel";
import classNames from "classnames";
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { followChannel, getChannel, unfollowChannel } from "../../api/channel";
import { Navigation } from "../../common/Navigation"
import { VideoMenu } from "../../components/VideoMenu";
import useAuth from "../../hooks/useAuth";
import { useRoom } from "../../hooks/useRoom";
import { BrowserModal } from "./BrowserModal";
import { ChatBox } from "./ChatBox";
import { UserProfile } from "./UserProfile";
import "./UserChannel.css";
import { defaultNotificationOpts, useNotification } from "../../hooks/useNotifications";
import { useChannel } from "../../hooks/useChannel";
import { ChannelSettingsBrowserModal } from "./ChannelSettingsModal";

type UserChannelPageParams = {
    username: string
}

export const UserChannelPage = (): JSX.Element => {
    const [browserActive, setBrowserActive] = useState(false);
    const [settingsActive, setSettingsActive] = useState(false);
    const [channel, setChannel] = useState<(Omit<IUserChannel, 'followers'> & {followers: number}) | null>();
    const [searching, setSearching] = useState(true);
    const [clientFollowed, setClientFollowed] = useState(false);
    const notifications = useNotification();
    const { username } = useParams<UserChannelPageParams>();
    const { joinRoom } = useRoom();
    const { user, updateUser } = useAuth();
    const { channelData } = useChannel();
    
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
                joinRoom(username!);
            }
        }
        sendGetChannel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username])

    const toggleBrowserActive = () => {
        setBrowserActive(!browserActive);
    }

    const toggleSettingsActive = () => {
        setSettingsActive(!settingsActive);
    }
    
    const handleFollow = async () => {
        try {
            await followChannel(username!);
            updateUser();
            setClientFollowed(true);
        } catch (e) {
            notifications.addNotification({
                ...defaultNotificationOpts,
                type : "danger",
                title : "Error",
                message : (e as Error)?.message
            });
        }
    }

    const handleUnfollow = async () => {
        try {   
            await unfollowChannel(username);
            setClientFollowed(false);
            updateUser();
        } catch (e) {
            notifications.addNotification({
                ...defaultNotificationOpts,
                type : "danger",
                title : "Error",
                message : (e as Error)?.message
            });
        }
    }

    const handleBrowserOutsideClick = () => {
        if (browserActive) {
            setBrowserActive(false);
        }
    }

    const mobileClassListIfBrowserActive = browserActive ? "hidden lg:flex" : "block";
    const alreadyFollowed = user?.following?.find(v => v.followedTo?.id === channel?.id) != null || clientFollowed;

    return (
        <div>
            <div className={classNames("hidden fixed w-screen h-screen top-0 left-0 z-10 bg-opacity-70 bg-darkblack ", browserActive ? "lg:block" : "")} onClick={handleBrowserOutsideClick}></div>
            <Navigation className={classNames(mobileClassListIfBrowserActive, "lg:fixed lg:z-10 lg:top-0")} />
            {
                 !searching && channel != null ?
                 <div className="h-screen flex flex-col lg:block channel_elements lg:overflow-y-scroll lg:relative lg:mt-17 lg:mr-96">
                     <BrowserModal roomId={username} className="z-20 lg:w-20" active={browserActive} setActive={setBrowserActive} />
                     <ChannelSettingsBrowserModal roomId={username} className="z-20" active={settingsActive} setActive={setSettingsActive} />
                     <VideoMenu ownerView={user?.name === username} className={classNames(mobileClassListIfBrowserActive, 'md:h-5/6')} handleOpenBrowser={toggleBrowserActive} handleOpenSettings={toggleSettingsActive} isAuthenticated={user?.id !== 0} channelId={username} playerHeight="91.2%" viewerCount={channelData.viewerCount} />
                     <ChatBox className={classNames(mobileClassListIfBrowserActive, "md:min-h-96 lg:mt-24px lg:fixed lg:right-0 lg:top-17 lg:h-93p lg:w-96")}  username={username} />
                     <UserProfile className={classNames(mobileClassListIfBrowserActive, "z-10")} username={username} followerCount={channel?.followers ?? 0} followed={alreadyFollowed} handleFollow={handleFollow} handleUnfollow={handleUnfollow} description={{title: channel.desc_title, content: channel.desc}}/>
                 </div> : 
                 <div className="h-screen flex flex-col lg:mt-17">
                     <div>Channel doesn't exist :(</div>
                 </div>
            }
        </div>
    )
}