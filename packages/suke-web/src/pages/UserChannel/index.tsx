import React from "react"
import { useParams } from "react-router-dom";
import { Navigation } from "../../common/Navigation"
import { VideoMenu } from "../../components/VideoMenu";
import { ChatBox } from "./ChatBox";
import { UserProfile } from "./UserProfile";


type UserChannelPageParams = {
    username: string
}

export const UserChannelPage = (): JSX.Element => {
    const { username } = useParams<UserChannelPageParams>();
    return (
        <div className="h-screen flex flex-col">
            <Navigation />
            <VideoMenu />
            <ChatBox />
            <UserProfile username={username} followerCount={3}/>
        </div>
    )
}