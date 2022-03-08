import { Link } from "react-router-dom"
import { Circle } from "../Circle"
import { ImageCircle } from "../ImageCircle"
import numeral from "numeral";
import { useCategory } from "@suke/suke-web/src/hooks/useCategory";

export interface ChannelCardProps {
    viewerCount: number;
    thumbnailUrl?: string;
    title: string;
    author: {
        name: string;
        pictureUrl: string;
    },
    category: string;
}

export const ChannelCard = ({viewerCount, title, author, thumbnailUrl, category}: ChannelCardProps) => {
    const { categories } = useCategory();

    const currentCategory = categories.find(v => v.value === category)?.label || category;

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
                    <ImageCircle src={author.pictureUrl} alt={"profile picture of user " + author.name} className="p-1 transform hover:scale-95 cursor-pointer"></ImageCircle>
                </Link>
                <div className="text-white">
                    <Link to={"/" + author.name}>
                        <h4 className="font-semibold ml-3 mt-1 leading-none transform hover:text-gray cursor-pointer">{title}</h4>
                        <div className="flex mt-1 ml-3 font-light">
                            <p className="align-top text-sm leading-none transform hover:text-gray cursor-pointer">{author.name}</p>
                            <Circle size={0.5} backgroundColor="lightgray" className="mt-1.5 mx-1.2"/>
                            <p className="align-top text-sm text-lightgray leading-none hover:text-gray cursor-pointer">{currentCategory?.charAt(0).toUpperCase() + currentCategory!.slice(1)}</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}