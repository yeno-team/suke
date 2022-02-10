import { Navigation } from "../../common/Navigation";
import { FeaturedSlider } from "./FeaturedSlider"
import { FeaturedTheaterItem } from "@suke/suke-core/src/entities/TheaterItem";
import { Button } from "@suke/suke-web/src/components/Button";
import { TheaterNavBar } from "./TheaterNavBar";
import { Schedule } from "./Schedule";
import { useState } from "react";


export const TheaterPage = () => {
    const [searchInput, setSearchInput] = useState("");
 
    const featuredMovies: FeaturedTheaterItem[] = [
        {
            title: 'Spider-Man: No Way Home',
            description: 'Watch Spider-Man take on villians from the multiverse.',
            backgroundImage: 'https://www.cnet.com/a/img/K4UATXNGIzmj16LfEm2of9Osytg=/1092x0/2021/11/29/82fb5acc-9155-4844-be9c-e0831a6b837c/nowayhome.jpg',
            id: 1
        },
        {
            title: 'Bleach: TYBW',
            description: 'Watch the final arc of Bleach.',
            backgroundImage: 'https://preview.redd.it/pm8zlk4iqz021.jpg?auto=webp&s=ab28af3542e56ad1072e859ff10cccd9336d1aeb',
            id: 2
        }
    ]  

    const featuredItems = featuredMovies.map(v => 
        <div key={v.id} className="h-100 w-full relative">
            <div className="bg-greatblack fixed top-0 w-screen h-full opacity-80"></div>
            <div 
             style={{backgroundImage: `url("${v.backgroundImage}")`}} 
             className="w-full h-full bg-no-repeat bg-cover"
            ></div>
            <div className="absolute bottom-36 left-2/10 transform text-white font-signika">
                <h1 className="text-3xl font-bold">{v.title.toUpperCase()}</h1>
                <p className="font-light mt-px text-lg">{v.description}</p>
                <Button backgroundColor="blue" size={3} className="rounded mt-6" fontSize="sm" fontWeight="semibold">VIEW SCHEDULE</Button>
            </div>
        </div>
    );
    return (
        <div className="bg-spaceblack h-screen overflow-y-scroll overflow-x-hidden">
            <Navigation />
            <FeaturedSlider items={featuredItems} />
            <TheaterNavBar searchInput={searchInput} setSearchInput={setSearchInput} />
            <Schedule searchInput={searchInput} />
        </div>
    )
}