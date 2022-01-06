import { Link } from "react-router-dom"
import { ImageCircle } from "../ImageCircle"


export interface ChannelCardProps {
    viewerCount: number;
    thumbnailUrl?: string;
    title: string;
    author: {
        name: string;
        pictureUrl: string;
    }
}

export const ChannelCard = ({viewerCount, title, author, thumbnailUrl}: ChannelCardProps) => {
    return (
        <div className="font-sans inline-block my-1 mr-3 relative w-full md:w-5/12 max-w-300">
            <div className="absolute z-30 right-2 top-2 bg-newblack bg-opacity-80 text-white text-sm p-1 cursor-default">
                {viewerCount} viewers
            </div>
            <Link to={"/" + author.name}>
                <img src={thumbnailUrl} alt="Thumbnail preview of channel" className="w-full max-h-full transform hover:scale-105 cursor-pointer"></img>
            </Link>
            <div className="flex p-2 pl-0">
                <Link to={"/" + author.name}>
                    <ImageCircle src={author.pictureUrl} alt={"profile picture of user " + author.name} className="p-1 transform hover:scale-105 cursor-pointer"></ImageCircle>
                </Link>
                <div className="text-white">
                    <Link to={"/" + author.name}>
                        <h4 className="font-semibold ml-3 mt-1 leading-none transform hover:scale-105 cursor-pointer">{title}</h4>
                        <p className="ml-3 font-light mt-1 align-top text-sm leading-none transform hover:scale-105 cursor-pointer">{author.name}</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}