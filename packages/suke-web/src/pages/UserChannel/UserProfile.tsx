import React from "react"
import { Icon } from '@iconify/react';
import { ImageCircle } from "../../components/ImageCircle"
import { Button } from "../../components/Button"

export type UserProfileParams = {
    username: string;
    followerCount: number;
    className: string;
    followed: boolean;
    handleFollow: () => void;
    handleUnfollow: () => void;
} 

export const UserProfile = ({username, followerCount, className, followed, handleFollow, handleUnfollow}: UserProfileParams) => {
    
    return (
        <div className={"flex bg-black font-sans " + className}>
            <div className="flex px-4 py-5 flex-grow">
                <ImageCircle src="https://picsum.photos/200" alt="user profile pic"></ImageCircle>
                <div className="flex flex-col justify-center text-left  leading-none items-center">
                    <span className="block font-bold w-full ml-4 text-white">{username}</span>
                    <span className="font-normal text-sm w-full ml-4 text-gray">{followerCount} followers</span>
                </div>
            </div>
            <div className="mr-4 my-auto">
                <Button className="mr-1" size={2} square backgroundColor="coolorange" fontWeight="semibold" >
                    <Icon icon="fa-solid:share-alt" className="text-base text-white" />
                </Button>
                <Button className="mr-1" size={2} square backgroundColor="red" fontWeight="semibold"/>
                <Button size={2} backgroundColor="coolorange" fontWeight="semibold" >
                    <Icon icon="fa-solid:share-alt" className="text-base text-white" />
                </Button>
                <Button size={2} backgroundColor="red" fontWeight="semibold" >
                    <Icon icon="ic:sharp-report-problem" className="text-base text-white" />
                </Button>
                {
                    !followed ?
                    <Button size={3} backgroundColor="teal" fontWeight="semibold" onClick={handleFollow}>
                        <Icon icon="akar-icons:plus" className="text-base mr-1 text-white" /> FOLLOW
                    </Button> : 
                    <Button size={3} backgroundColor="darkgray" fontWeight="semibold" onClick={handleUnfollow}>
                        <Icon icon="akar-icons:cross" className="text-base mr-1 text-white" /> UNFOLLOW
                    </Button>
                }   
            </div>
        </div>
    )
}