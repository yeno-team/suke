import React from "react"
import { Columns, Heading, Image } from "react-bulma-components"


export const UserProfile = () => {
    return (
        <React.Fragment>
            <Columns p="smaller">
                <Columns.Column size={1}>
                    <Image ml="mid" size={64} src="https://i.pravatar.cc/300" rounded/>
                </Columns.Column>
                <Columns.Column size={2}>
                    <Heading textSize={6} textColor="white">Khai52</Heading>
                    <Heading textColor="lightgray" subtitle>92 Followers</Heading>
                </Columns.Column>
            </Columns>
        </React.Fragment>
    )
}