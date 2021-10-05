import React from "react"
import { Columns, Heading, Image } from "react-bulma-components";
import { useParams } from "react-router-dom";
import { Navigation } from "../../common/Navigation"
import { VideoMenu } from "../../components/VideoMenu";
import './userChannel.scss';
import { UserProfile } from "./UserProfile";

type UserChannelPageParams = {
    username: string
}

export const UserChannelPage = (): JSX.Element => {
    const { username } = useParams<UserChannelPageParams>();

    return (
        <React.Fragment>
            <Navigation />
            <Columns mb="big-4" className="is-gapless">
                <Columns.Column className="video-menu-column" size={9}>
                    <VideoMenu />
                </Columns.Column>
                <Columns.Column className="chat-column" backgroundColor="gray">
                </Columns.Column>
            </Columns>
            <Columns>
                <Columns.Column backgroundColor="coolblack" size={9}>
                    <UserProfile username={username} />
                    <div className="divider is-marginless "></div>
                </Columns.Column>
            </Columns>
        </React.Fragment>
    )
}