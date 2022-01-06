import { Navigation } from "../../common/Navigation"
import { HeroImage } from "../../components/HeroImage"
import HeroImageFile from "../../assets/hero.png";
import { Button } from "../../components/Button";
import { ChannelCard } from "../../components/ChannelCard";
import { TheaterCard } from "../../components/TheaterCard";
import { CategoryCard } from "../../components/CategoryCard";

export const HomePage = () => {
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
                    <ChannelCard viewerCount={324} title="The Flash S4 EP3" author={{name: "Lunatite", pictureUrl: "https://picsum.photos/100"}} thumbnailUrl="https://picsum.photos/325/200"></ChannelCard>
                    <ChannelCard viewerCount={324} title="The Flash S4 EP3" author={{name: "Lunatite", pictureUrl: "https://picsum.photos/100"}} thumbnailUrl="https://picsum.photos/325/200"></ChannelCard>
                    <ChannelCard viewerCount={324} title="The Flash S4 EP3" author={{name: "Lunatite", pictureUrl: "https://picsum.photos/100"}} thumbnailUrl="https://picsum.photos/325/200"></ChannelCard>
                    <ChannelCard viewerCount={324} title="The Flash S4 EP3" author={{name: "Lunatite", pictureUrl: "https://picsum.photos/100"}} thumbnailUrl="https://picsum.photos/325/200"></ChannelCard>
                    <ChannelCard viewerCount={324} title="The Flash S4 EP3" author={{name: "Lunatite", pictureUrl: "https://picsum.photos/100"}} thumbnailUrl="https://picsum.photos/325/200"></ChannelCard>
                    <ChannelCard viewerCount={324} title="The Flash S4 EP3" author={{name: "Lunatite", pictureUrl: "https://picsum.photos/100"}} thumbnailUrl="https://picsum.photos/325/200"></ChannelCard>
                    <ChannelCard viewerCount={324} title="The Flash S4 EP3" author={{name: "Lunatite", pictureUrl: "https://picsum.photos/100"}} thumbnailUrl="https://picsum.photos/325/200"></ChannelCard>
                    <ChannelCard viewerCount={324} title="The Flash S4 EP3" author={{name: "Lunatite", pictureUrl: "https://picsum.photos/100"}} thumbnailUrl="https://picsum.photos/325/200"></ChannelCard>
                    <ChannelCard viewerCount={324} title="The Flash S4 EP3" author={{name: "Lunatite", pictureUrl: "https://picsum.photos/100"}} thumbnailUrl="https://picsum.photos/325/200"></ChannelCard>
                    <ChannelCard viewerCount={324} title="The Flash S4 EP3" author={{name: "Lunatite", pictureUrl: "https://picsum.photos/100"}} thumbnailUrl="https://picsum.photos/325/200"></ChannelCard>
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
                    <CategoryCard name="123Movie" viewerCount="2.3K" imageUrl="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/best-movies-1614634680.jpg"></CategoryCard>
                    <CategoryCard name="Soap2Day" viewerCount="8K" imageUrl="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/fall-movies-index-1628968089.jpg"></CategoryCard>
                </div>
            </div>

            <div className="bg-black h-full pt-6 px-4 lg:pl-32">
                <h3 className="text-reallywhite font-base font-signika text-big mb-3">Channels You Follow</h3>
                <div>
                    <ChannelCard viewerCount={324} title="The Flash S4 EP3" author={{name: "Lunatite", pictureUrl: "https://picsum.photos/100"}} thumbnailUrl="https://picsum.photos/325/200"></ChannelCard>
                    <ChannelCard viewerCount={324} title="The Flash S4 EP3" author={{name: "Lunatite", pictureUrl: "https://picsum.photos/100"}} thumbnailUrl="https://picsum.photos/325/200"></ChannelCard>
                    <ChannelCard viewerCount={324} title="The Flash S4 EP3" author={{name: "Lunatite", pictureUrl: "https://picsum.photos/100"}} thumbnailUrl="https://picsum.photos/325/200"></ChannelCard>
                    <ChannelCard viewerCount={324} title="The Flash S4 EP3" author={{name: "Lunatite", pictureUrl: "https://picsum.photos/100"}} thumbnailUrl="https://picsum.photos/325/200"></ChannelCard>
                    <ChannelCard viewerCount={324} title="The Flash S4 EP3" author={{name: "Lunatite", pictureUrl: "https://picsum.photos/100"}} thumbnailUrl="https://picsum.photos/325/200"></ChannelCard>
                </div>
            </div>
        </div>
    )
}