import React from "react"
import { Button, Columns, Heading, Icon, Image } from "react-bulma-components"
import { Icon as IconElement } from '@iconify/react'

export type UserProfileParams = {
    username: string;
} 

export const UserProfile = ({username}: UserProfileParams) => {
    return (
        <React.Fragment>
            <Columns py="smaller2" px="mid" centered vCentered >
                <Columns.Column mr="0" narrow>
                    <Image ml="mid" size={64} src="https://i.pravatar.cc/300" rounded/>
                </Columns.Column>
                <Columns.Column className="is-flex" flexDirection="column" alignItems="flex-start" justifyContent="center" narrow>
                    <Heading textSize={5} textColor="white">{username}</Heading>
                    <Heading textSize={7} textColor="lightgray" subtitle>92 Followers</Heading>
                </Columns.Column>
                <Columns.Column mr="big" className="is-flex" flexDirection="row" justifyContent="right">
                    <Button.Group>
                        <Button color="brightorange" textWeight="semibold">
                            <Icon mr="smaller1">
                                <IconElement fontSize="18px" icon="ci:share" />
                            </Icon>
                            Share
                        </Button>
                        <Button color="red" textWeight="semibold">
                            <Icon mr="smaller1">
                                <IconElement fontSize="18px"icon="jam:triangle-danger-f" color="#f6fafb" />
                            </Icon>
                            Report
                        </Button>
                        <Button color="coolblue" textWeight="semibold">
                            <Icon mr="smaller2">
                                <IconElement fontSize="62px" icon="carbon:add" />
                            </Icon>
                            Follow
                        </Button>
                    </Button.Group>
                </Columns.Column>
            </Columns>
        </React.Fragment>
    )
}