import React, { useEffect } from "react"
import { useParams } from "react-router";
import { Navigation } from "../../common/Navigation"
import { VideoMenu } from "../../components/VideoMenu";
import { useRoom } from "../../hooks/useRoom";
import { ChatBox } from "./ChatBox";
import { UserProfile } from "./UserProfile";


type UserChannelPageParams = {
    username: string
}

export const UserChannelPage = (): JSX.Element => {
    const { username } = useParams() as UserChannelPageParams;
    const { joinRoom } = useRoom();

    useEffect(() => {
        joinRoom(username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username])

    return (
        <div className="h-screen flex flex-col">
            <Navigation />
            <VideoMenu url="https://www.youtube.com/watch?v=NpEaa2P7qZI" />
            <ChatBox username={username} />
            <UserProfile username={username} followerCount={3}/>
        </div>
    )
}