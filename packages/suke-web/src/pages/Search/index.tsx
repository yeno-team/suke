import { IUser } from "@suke/suke-core/src/entities/User";
import { RealtimeRoomData } from "@suke/suke-core/src/types/UserChannelRealtime";
import { searchChannels, searchUsers } from "@suke/suke-web/src/api/search";
import { ChannelCard } from "@suke/suke-web/src/components/ChannelCard";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Navigation } from "../../common/Navigation";

type SearchPageParams = {
    searchTerm: string
}

export const SearchPage = () => {
    const [channels, setChannels] = useState<RealtimeRoomData[]>([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<IUser[]>([]);
    const { searchTerm } = useParams<SearchPageParams>();
    const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
    const [pageNumber, setPageNumber] = useState(1);

    const getNextPage = async () => {
        try {
            const channels = await searchChannels(searchTerm || "", {
                pageNumber: pageNumber+1, 
                limit: 25, 
                sortDirection
            });
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
        const init = async () => {
            try {
                const channels = await searchChannels(searchTerm || "", {
                    pageNumber: 1, 
                    limit: 25, 
                    sortDirection
                });
                const users = await searchUsers(searchTerm || "", {
                    pageNumber: 1,
                    limit: 5,
                    sortDirection
                });

                setUsers(users);
                setChannels(channels);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, [searchTerm, sortDirection]);


    const filteredUsers = useMemo(() => {
        return users.filter(v => !channels.find(channel => channel.id.toLowerCase() === v.name.toLowerCase()));
    }, [channels, users]);

    return (
        <div className="bg-darkblack h-full flex flex-col flex-wrap text-center md:text-left" onScroll={handleScroll}>
            <Navigation></Navigation>
            <div className="flex mt-12 mb-4 md:ml-20 font-sans">
                <h1 className="text-white font-semibold text-2xl">
                    Search Results for "{searchTerm}"
                </h1>
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
                    channels.length > 0 || filteredUsers.length > 0 ? (
                        <React.Fragment>
                            {
                                channels.map(v => <ChannelCard key={v.id} viewerCount={v.viewerCount} title={v.title} author={{name: v.id}} thumbnailUrl={v.thumbnail.url.toString()} category={v.category}></ChannelCard>)
                            }
                            {
                                filteredUsers.map(v => <ChannelCard key={v.id} offline={true} viewerCount={0} title={"Offline"} author={{name: v.name}} thumbnailUrl={""} category={"Offline"}></ChannelCard>)
                            }
                        </React.Fragment>
                    ) :
                    (
                        loading ?
                        <h1 className="text-gray">Searching...</h1> :
                        <h1 className="text-brightred font-semibold">No results.</h1>
                    )
                }
            </div>
        </div>
    )
}