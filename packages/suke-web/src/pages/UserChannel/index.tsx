import React from "react"
import { useParams } from "react-router-dom";
import { Navigation } from "../../common/Navigation"


type UserChannelPageParams = {
    username: string
}

export const UserChannelPage = (): JSX.Element => {
    const { username } = useParams<UserChannelPageParams>();
    return (
        <React.Fragment>
            <Navigation />
        </React.Fragment>
    )
}