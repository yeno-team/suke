import React from "react"
import { Icon } from '@iconify/react'
import { ImageCircle } from "../../components/ImageCircle"
import { Button } from "../../components/Button"

export type UserProfileParams = {
    username: string;
    followerCount: number;
} 

export const UserProfile = ({username, followerCount}: UserProfileParams) => {
    return (
        <div className="flex bg-black font-sans">
            <div className="flex px-4 py-5 flex-grow">
                <ImageCircle src="https://picsum.photos/200" alt="user profile pic"></ImageCircle>
                <div className="flex flex-col justify-center leading-none items-center">
                    <span className="block font-bold ml-1 text-white">{username}</span>
                    <span className="font-normal text-sm ml-3 text-gray">{followerCount} followers</span>
                </div>
            </div>
            <div className="mr-4 my-auto">
                <Button size={2} square backgroundColor="coolorange" fontWeight="semibold" >
                    <Icon icon="fa-solid:share-alt" className="text-base text-white" />
                </Button>
                <Button size={2} square backgroundColor="red" fontWeight="semibold" >
                    <Icon icon="ic:sharp-report-problem" className="text-base text-white" />
                </Button>
                <Button size={3} backgroundColor="teal" fontWeight="semibold" >
                    <Icon icon="akar-icons:plus" className="text-base mr-1 text-white" /> FOLLOW
                </Button>
            </div>
        </div>
    )
}