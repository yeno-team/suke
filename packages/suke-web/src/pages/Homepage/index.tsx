import { Navigation } from "../../common/Navigation"
import { HeroImage } from "../../components/HeroImage"
import HeroImageFile from "../../assets/hero.png";
import { Button } from "../../components/Button";
import { ChannelCard } from "../../components/ChannelCard";
import { TheaterCard } from "../../components/TheaterCard";
import { CategoryCard } from "../../components/CategoryCard";
import { useCategory } from "../../hooks/useCategory";
import React, { useEffect, useState } from "react";
import { RealtimeChannelData } from "@suke/suke-core/src/types/UserChannelRealtime";
import { getRealtimeChannels } from "@suke/suke-web/src/api/realtime";
import numeral from "numeral";

export const HomePage = () => {
    const [realtimeChannels, setRealtimeChannels] = useState<RealtimeChannelData[]>();
    const { categories } = useCategory();

    useEffect(() => {
        async function sendRequest() {
            try {
                const data = await getRealtimeChannels();
                console.log(data);
                setRealtimeChannels(data);
            } catch (e) {
                console.error(e);
            }
            
        }
        sendRequest();
    }, []);
    
    return (
        <div>
            <Navigation></Navigation>
            <HeroImage imageUrl={HeroImageFile} className="text-white">
                <div className='text-center py-28'>
                    <h1 className="font-bold text-2xl font-signika mb-5">Watch new TV show episodes or Movies together with others</h1>
                    <Button className="mx-auto rounded px-5" backgroundColor="blue" fontWeight="bold">BROWSE THEATER</Button>
                </div>
            </HeroImage>
            <div className="bg-black h-full pt-6 px-4 lg:pl-32">
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

            <div className="bg-black h-full pt-6 px-4 lg:pl-32">
                <h3 className="text-reallywhite font-base font-signika text-big mb-3">Theater rooms that are about to start!</h3>
                <div>
                    <TheaterCard subheading="EPISODE 1" title="BLEACH: TYBW" countdown="4:23" viewerCount={324} coverUrl="https://cdn.myanimelist.net/images/anime/1256/120125.jpg"></TheaterCard>
                    <TheaterCard subheading="EPISODE 1" title="BLEACH: TYBW" countdown="4:23" viewerCount={324} coverUrl="https://cdn.myanimelist.net/images/anime/1256/120125.jpg"></TheaterCard>
                </div>
            </div>

            <div className="bg-black h-full pt-6 px-4 lg:pl-32">
                <h3 className="text-reallywhite font-base font-signika text-big mb-3">Categories you might enjoy</h3>
                <div>
                    {
                        categories.map(v => <CategoryCard key={v.id} name={v.label} viewerCount={numeral(v.viewerCount).format("0.[0]a")} imageUrl={v.thumbnail_url}></CategoryCard>)
                    }
                    
                </div>
            </div>

            <div className="bg-black h-full pt-6 px-4 lg:pl-32">
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