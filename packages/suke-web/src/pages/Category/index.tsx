import { RealtimeChannelData } from "@suke/suke-core/src/types/UserChannelRealtime";
import { getCategoryChannels } from "@suke/suke-web/src/api/category";
import { ChannelCard } from "@suke/suke-web/src/components/ChannelCard";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Navigation } from "../../common/Navigation";

type CategoryPageParams = {
    categoryValue: string
}

export const CategoryPage = () => {
    const [channels, setChannels] = useState<RealtimeChannelData[]>([]);
    const [loading, setLoading] = useState(true);
    const { categoryValue } = useParams<CategoryPageParams>();
    const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
    const [pageNumber, setPageNumber] = useState(1);

    const getNextPage = async () => {
        try {
            const channels = await getCategoryChannels(categoryValue as string, pageNumber+1, 25, sortDirection);
            if (channels.length > 0) {
                setChannels(prev => [...prev, ...channels]);
                setPageNumber(pageNumber + 1);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;

        if (bottom && !loading) { 
            getNextPage();
        }
    }

    useEffect(() => {
        const getChannels = async () => {
            try {
                const channels = await getCategoryChannels(categoryValue as string, 1, 25, sortDirection);
                setChannels(channels);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        getChannels();
    }, [categoryValue, sortDirection]);

    const categoryDisplayName = categoryValue!.split("_").flatMap(v => v.charAt(0).toUpperCase() + v.substr(1)).join(" ");

    return (
        <div className="bg-darkblack h-full flex flex-col flex-wrap text-center md:text-left" onScroll={handleScroll}>
            <Navigation></Navigation>
            <div className="flex mt-12 mb-4 md:ml-20 font-sans">
                <h1 className="text-white font-semibold text-2xl"><h3 className="inline-block font-black">{ categoryDisplayName }</h3> Channels</h1>
                <div className="ml-auto md:mr-20 flex">
                    <h1 className="text-white font-semibold mr-3 leading-none my-auto">Sort By</h1>
                    <select className="bg-black text-lightgray rounded text-sm p-1" value={sortDirection} onChange={(e) => setSortDirection(e.target.value as "ASC" | "DESC")}>
                        <option value="DESC">High To Low (viewers)</option>
                        <option value="ASC">Low To High (viewers)</option>
                    </select>
                </div>
            </div>
            <div className="w-full px-20 min-h-screen">
                {
                    channels.length > 0 ?
                    channels.map(v => <ChannelCard key={v.id} viewerCount={v.viewerCount} title={v.title} author={{name: v.id, pictureUrl: "https://picsum.photos/100"}} thumbnailUrl={v.thumbnail.url.toString()} category={v.category}></ChannelCard>) :
                    (
                        <h1 className="text-brightRed font-semibold">There are currently no public channels live for this category.</h1>
                    )
                }
            </div>
        </div>
    )
}