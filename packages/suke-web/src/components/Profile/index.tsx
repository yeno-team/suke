import React from "react"
import { Icon } from '@iconify/react';
import { Button } from "../Button"
import classNames from "classnames"
import { UserProfilePicture } from "../../common/UserProfilePicture";

export type ProfileParams = {
    username?: string;
    description: {
        title: string,
        content: string
    };
    followerButtonActive?: boolean;
    followerCount?: number;
    pictureFileName?: string;
    className: string;
    followed?: boolean;
    handleFollow?: () => void;
    handleUnfollow?: () => void;
} 

export const Profile = ({username, pictureFileName, followerCount, className, followed, handleFollow, handleUnfollow, description, followerButtonActive}: ProfileParams) => {
    return (
        <div className={classNames("flex flex-col bg-black font-sans", className)}>
            <div className="flex flex-1">
                <div className="flex px-4 py-5 flex-grow lg:pl-10">
                    <UserProfilePicture fileName={pictureFileName} />
                    <div className="flex flex-col justify-center text-left  leading-none items-center">
                        <span className="block font-bold w-full ml-7 text-white">{username}</span>
                        <span className="font-normal text-sm w-full ml-7 text-gray">{followerCount} followers</span>
                    </div>
                </div>
                <div className="mr-4 my-auto">
                    <Button className="mr-1 lg:mr-2" size={2} square backgroundColor="coolorange" fontWeight="semibold" >
                        <Icon icon="fa-solid:share-alt" className="text-base text-white" />
                        <span className="hidden lg:block font-semibold ml-2 text-sm">
                            SHARE
                        </span>
                    </Button>
                    <Button className="mr-1 lg:mr-2" size={2} square backgroundColor="red" fontWeight="semibold" >
                        <Icon icon="ic:sharp-report-problem" className="text-base text-white" />
                        <span className="hidden lg:block font-semibold ml-2 text-sm">
                            REPORT
                        </span>
                    </Button>
                    {
                        followerButtonActive &&
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
            <div className="hidden h-px bg-white lg:block"></div>
            <div className="hidden pl-20 py-10 text-white lg:block">
                <h1 className="font-bold text-xl">{description.title}</h1>
                <p className="font-light text-base mb-20">{description.content}</p>
            </div>
        </div>
    )
}