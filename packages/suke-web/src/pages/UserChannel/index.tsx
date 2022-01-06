
import { IUserChannel } from "@suke/suke-core/src/entities/UserChannel/UserChannel";
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


type UserChannelPageParams = {
    username: string
}

export const UserChannelPage = (): JSX.Element => {
    const [browserActive, setBrowserActive] = useState(false);
    const [channel, setChannel] = useState<(Omit<IUserChannel, 'followers'> & {followers: number}) | null>();
    const [searching, setSearching] = useState(true);
    const { username } = useParams<UserChannelPageParams>();
    const { joinRoom } = useRoom();
    const { user, updateUser } = useAuth();
    
    useEffect(() => {
        const sendGetChannel = async () => {
            try {
                setSearching(true);
                const channelResp = await getChannel(username);
                setChannel(channelResp);
            } catch (e) {
                console.warn(e);
            } finally { 
                setSearching(false);
                joinRoom(username);
            }
        }
        sendGetChannel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username])

    const toggleBrowserActive = () => {
        setBrowserActive(!browserActive);
    }
    
    const handleFollow = async () => {
        try {
            await followChannel(username);
            updateUser();
        } catch (e) {
            console.warn(e);
        }
    }

    const handleUnfollow = async () => {
        try {   
            await unfollowChannel(username);
            updateUser();
        } catch (e) {
            console.warn(e);
        }
    }

    const mobileClassListIfBrowserActive = browserActive ? "hidden lg:block" : "block";
    const alreadyFollowed = user?.following?.find(v => v.followedTo?.id === channel?.id) != null;
    
    return (
        !searching && channel != null ?
        <div className="h-screen flex flex-col">
            <Navigation className={mobileClassListIfBrowserActive} />
            <BrowserModal roomId={username} className="flex-grow" active={browserActive} setActive={setBrowserActive} />
            <VideoMenu ownerView={user?.name === username} className={mobileClassListIfBrowserActive} handleOpenBrowser={toggleBrowserActive} isAuthenticated={user?.id !== 0} channelId={username} />
            <ChatBox className={mobileClassListIfBrowserActive} username={username} />
            <UserProfile className={mobileClassListIfBrowserActive} username={username} followerCount={channel?.followers ?? 0} followed={alreadyFollowed} handleFollow={handleFollow} handleUnfollow={handleUnfollow}/>
        </div> : 
        <div className="h-screen flex flex-col">
            <Navigation className={mobileClassListIfBrowserActive} />
            <div>Channel doesn't exist :(</div>
        </div>
    )
}