import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom"
import { Circle } from "../Circle"
import { ImageCircle } from "../ImageCircle"
import numeral from "numeral";
import { useCategory } from "@suke/suke-web/src/hooks/useCategory";
import { UserProfilePicture } from "../../common/UserProfilePicture";
import { getUserByName } from "../../api/user";
import { IUser } from "@suke/suke-core/src/entities/User";

export interface ChannelCardProps {
    viewerCount: number;
    thumbnailUrl?: string;
    title: string;
    author: {
        name: string;
    },
    category: string;
}

export const ChannelCard = ({viewerCount, title, author, thumbnailUrl, category}: ChannelCardProps) => {
    const { categories } = useCategory();
    const [user, setUser] = useState<IUser | null>();

    useEffect(() => {
        const sendRequest = async () => {
            const grabbedUser = await getUserByName(author.name);

            setUser(grabbedUser);
        }
        sendRequest();
    }, [author.name])

    const foundCategory = useMemo(() => categories.find(v => v.value === category), [categories, category]);
    const currentCategory = foundCategory?.label || category;

    return (
        <div className="font-sans inline-block my-1 mr-3 relative w-full md:w-5/12 max-w-300">
            <div className="absolute z-30 right-2 top-2 leading-none bg-newblack bg-opacity-80 p-1 cursor-default h-6 text-white text-sm px-2">
                {numeral(viewerCount).format("0.[0]a")} viewers
            </div>
            <div className="absolute z-30 left-2 bottom-20 font-base leading-none bg-red cursor-default text-white font-semibold text-xs p-1.2 py-0.5">
                LIVE
            </div>

            <Link to={"/" + author.name}>
                <div className="h-44 bg-cover bg-no-repeat bg-center transform hover:scale-105" style={{backgroundImage: `url(${thumbnailUrl})`}}></div>
            </Link>
            <div className="flex p-2 pl-0">
                <Link to={"/" + author.name}>
                    <UserProfilePicture fileName={user?.pictureFilename} />
                </Link>
                <div className="text-white">
                    <h4 className="font-semibold ml-3 mt-1 leading-none transform hover:text-gray cursor-pointer">{title}</h4>
                        <div className="flex mt-1 ml-3 font-light">
                            <Link to={"/" + author.name}>
                                <p className="align-top text-sm leading-none transform hover:text-gray cursor-pointer">{author.name}</p>
                            </Link>
                            <Circle size={0.5} backgroundColor="lightgray" className="mt-1.5 mx-1.2"/>
                            <Link to={"/categories/"+foundCategory?.value}>
                                <p className="align-top text-sm text-lightgray leading-none hover:text-gray cursor-pointer">{currentCategory?.charAt(0).toUpperCase() + currentCategory!.slice(1)}</p>
                            </Link>
                        </div>
                    
                </div>
            </div>
        </div>
    )
}