
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { Navigation } from "../../common/Navigation"
import { VideoMenu } from "../../components/VideoMenu";
import { useRoom } from "../../hooks/useRoom";
import { BrowserModal } from "./BrowserModal";
import { ChatBox } from "./ChatBox";
import { UserProfile } from "./UserProfile";


type UserChannelPageParams = {
    username: string
}

export const UserChannelPage = (): JSX.Element => {
    const [browserActive, setBrowserActive] = useState(false);
    const { username } = useParams<UserChannelPageParams>();
    const { joinRoom } = useRoom();

    useEffect(() => {
        joinRoom(username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username])

    const toggleBrowserActive = () => {
        setBrowserActive(!browserActive);
    }

    const mobileClassListIfBrowserActive = browserActive ? "hidden md:block" : "block";

    return (
        <div className="h-screen flex flex-col">
            <Navigation className={mobileClassListIfBrowserActive} />
            <BrowserModal className="flex-grow" active={browserActive} setActive={setBrowserActive} />
            <VideoMenu className={mobileClassListIfBrowserActive} url="https://www.youtube.com/watch?v=NpEaa2P7qZI" handleOpenBrowser={toggleBrowserActive} />
            <ChatBox className={mobileClassListIfBrowserActive} username={username} />
            <UserProfile className={mobileClassListIfBrowserActive} username={username} followerCount={3}/>
        </div>
    )
}