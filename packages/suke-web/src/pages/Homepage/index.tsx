import { Navigation } from "../../common/Navigation"
import { HeroImage } from "../../components/HeroImage"
import HeroImageFile from "../../assets/hero.png";
import { Button } from "../../components/Button";
import { ChannelCard } from "../../components/ChannelCard";
import { TheaterCard } from "../../components/TheaterCard";
import { CategoryCard } from "../../components/CategoryCard";
import { useCategory } from "../../hooks/useCategory";
import React, { useEffect, useMemo, useState } from "react";
import { RealtimeRoomData } from "@suke/suke-core/src/types/UserChannelRealtime";
import { getRealtimeChannels } from "@suke/suke-web/src/api/realtime";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import { useTheaterRoom } from "@suke/suke-web/src/hooks/useTheaterRoom";
import { getTheaterItems } from "@suke/suke-web/src/api/theater";
import { ITheaterItem } from "@suke/suke-core/src/entities/TheaterItem";
import { ScheduleState } from "@suke/suke-core/src/entities/TheaterItemSchedule";

export const HomePage = () => {
    const [realtimeChannels, setRealtimeChannels] = useState<RealtimeRoomData[]>();
    const { categories } = useCategory();
    const [theaterItems, setTheaterItems] = useState<ITheaterItem[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        async function sendInitRequest() {
            try {
                const channelsData = await getRealtimeChannels();
                const theaterItems = await getTheaterItems();
                setRealtimeChannels(channelsData);
                setTheaterItems(theaterItems);
            } catch (e) {
                console.error(e);
            }
            
        }
        sendInitRequest();
    }, []);
    
    const theaterItemsStarting = useMemo(() => {
        let i = 0;
        return theaterItems.filter(v => {
            if (v.schedules.some(s => s.state === ScheduleState.Starting) && i < 6) {
                return true;
            }

            return false;
        });
    }, [theaterItems]);

    return (
        <div>
            <Navigation></Navigation>
            <HeroImage imageUrl={HeroImageFile} className="text-white">
                <div className='text-center py-28'>
                    <h1 className="font-bold text-2xl font-signika mb-5">Watch new TV show episodes or Movies together with others</h1>
                    <Button className="mx-auto rounded px-5" backgroundColor="blue" fontWeight="bold" onClick={() => navigate('/theater')}>BROWSE THEATER</Button>
                </div>
            </HeroImage>
            <div className="bg-darkblack h-full pt-6 px-4 lg:pl-32">
                <h3 className="text-reallywhite font-base font-signika text-big mb-3">Popular channels right now</h3>
                <div>
                    {
                        realtimeChannels != null && realtimeChannels.length > 0 ?
                        realtimeChannels.map(v => <ChannelCard key={v.id} viewerCount={v.viewerCount} title={v.title} author={{name: v.id, pictureUrl: "https://picsum.photos/100"}} thumbnailUrl={v.thumbnail.url.toString()} category={v.category}></ChannelCard>) :
                        (
                            <h1 className="text-brightRed font-semibold">There are currently no public channels live.</h1>
                        )
                    }
                </div>
            </div>

            <div className="bg-darkblack h-full pt-6 px-4 lg:pl-32">
                <h3 className="text-reallywhite font-base font-signika text-big mb-3">Theater rooms that are about to start!</h3>
                <div>
                    {
                        theaterItemsStarting.length > 0 ?
                        theaterItemsStarting.map(v => <TheaterCard key={v.id} subheading={v.episode ? "EPISODE " + v.episode.toString() : ""} title={v.title} scheduleId={v.schedules.find(v => v.state === ScheduleState.Starting)!.id} viewerCount={numeral(v.viewerCount).format("0.[0]a")} coverUrl={v.posterUrl}/>) :
                        <h1 className="text-brightRed font-semibold">There are currently no theater rooms starting.</h1>
                    }
                </div>
            </div>

            <div className="bg-darkblack h-full pt-6 px-4 lg:pl-32">
                <h3 className="text-reallywhite font-base font-signika text-big mb-3">Categories you might enjoy</h3>
                <div>
                    {
                        categories.length > 0 ?
                        categories.map(v => <CategoryCard key={v.id} onClick={() => navigate('/categories/' + v.value)} name={v.label} viewerCount={numeral(v.viewerCount).format("0.[0]a")} imageUrl={v.thumbnail_url}></CategoryCard>) :
                        <h1 className="text-gray font-semibold">Fetching categories...</h1>
                    }
                    
                </div>
            </div>

            <div className="bg-darkblack h-full pt-6 px-4 lg:pl-32">
                <h3 className="text-reallywhite font-base font-signika text-big mb-3">Channels You Follow</h3>
                <div>
                    <ChannelCard viewerCount={0} title={"Loading..."} author={{name: "Loading..", pictureUrl: "https://picsum.photos/100"}} thumbnailUrl={""} category="loading"></ChannelCard>
                    <ChannelCard viewerCount={0} title={"Loading..."} author={{name: "Loading..", pictureUrl: "https://picsum.photos/100"}} thumbnailUrl={""} category="loading"></ChannelCard>
                    <ChannelCard viewerCount={0} title={"Loading..."} author={{name: "Loading..", pictureUrl: "https://picsum.photos/100"}} thumbnailUrl={""} category="loading"></ChannelCard>
                    <ChannelCard viewerCount={0} title={"Loading..."} author={{name: "Loading..", pictureUrl: "https://picsum.photos/100"}} thumbnailUrl={""} category="loading"></ChannelCard>
                    <ChannelCard viewerCount={0} title={"Loading..."} author={{name: "Loading..", pictureUrl: "https://picsum.photos/100"}} thumbnailUrl={""} category="loading"></ChannelCard>
                </div>
            </div>
        </div>
    )
}