import { Navigation } from "../../common/Navigation";
import { FeaturedSlider } from "./FeaturedSlider"
import { FeaturedTheaterItem, TheaterCategory } from "@suke/suke-core/src/entities/TheaterItem";
import { TheaterNavBar } from "./TheaterNavBar";
import { Schedule } from "./Schedule";
import { useState } from "react";


export const TheaterPage = () => {
    const [searchInput, setSearchInput] = useState("");
    const [activeCategory, setActiveCategory] = useState(TheaterCategory.Everything);
 
    const featuredMovies: FeaturedTheaterItem[] = [
        {
            title: 'Spider-Man: No Way Home',
            description: 'Watch Spider-Man take on villians from the multiverse.',
            backgroundImage: 'https://www.cnet.com/a/img/K4UATXNGIzmj16LfEm2of9Osytg=/1092x0/2021/11/29/82fb5acc-9155-4844-be9c-e0831a6b837c/nowayhome.jpg',
            id: 1
        },
        {
            title: 'Uncharted',
            description: 'Watch Two partners on a dangerous quest to find a mysterious treasure.',
            backgroundImage: 'https://sportshub.cbsistatic.com/i/2022/01/13/8417257c-cf55-4e2d-83fe-cf9b00887497/uncharted-movie.jpg',
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
            <div className="absolute bottom-44 left-2/10 transform text-white font-signika">
                <h3 className="font-sans text-sm font-black tracking-widest text-coolorange leading-none -mb-px">FEATURED</h3>
                <h1 className="text-3xl font-bold leading-none mb-1">{v.title.toUpperCase()}</h1>
                <p className="font-light mt-px text-lg">{v.description}</p>
            </div>
        </div>
    );
    return (
        <div className="bg-spaceblack h-screen overflow-y-scroll overflow-x-hidden">
            <Navigation />
            <FeaturedSlider items={featuredItems} />
            <TheaterNavBar activeCategory={activeCategory} setActiveCategory={setActiveCategory} searchInput={searchInput} setSearchInput={setSearchInput}  />
            <Schedule searchInput={searchInput} activeCategory={activeCategory}/>
        </div>
    )
}