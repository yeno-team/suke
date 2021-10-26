import React from "react"
import { Icon as IconElement } from '@iconify/react'

export type UserProfileParams = {
    username: string;
} 

export const UserProfile = ({username}: UserProfileParams) => {
    return (
        <React.Fragment>
            <IconElement fontSize="18px" icon="ci:share" />
        </React.Fragment>
    )
}