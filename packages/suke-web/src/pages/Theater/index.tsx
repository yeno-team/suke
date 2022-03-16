import { Navigation } from "../../common/Navigation";
import { FeaturedSlider } from "./FeaturedSlider"
import { FeaturedTheaterItem, TheaterCategory, ITheaterItem } from "@suke/suke-core/src/entities/TheaterItem";
import { TheaterNavBar } from "./TheaterNavBar";
import { Schedule } from "./Schedule";
import React, { useEffect, useMemo, useState } from "react";
import { getTheaterItems } from "@suke/suke-web/src/api/theater";

export const TheaterPage = () => {
    const [searchInput, setSearchInput] = useState("");
    const [theaterItems, setTheaterItems] = useState<ITheaterItem[]>([]);
    const [activeCategory, setActiveCategory] = useState(TheaterCategory.everything);
    const featuredItemData: FeaturedTheaterItem[] = useMemo(() => theaterItems.filter(v => v.featured).map(v => ({
        title: v.title,
        description: v.description,
        backgroundImage: v.featuredPictureUrl,
        episode: v.episode,
        id: v.id
    })), [theaterItems]);
    
    useEffect(() => {
        async function fetchTheaterItems() {    
            try {
                setTheaterItems(await getTheaterItems());
            } catch (e) {
                console.error(e);
            }
        }
        fetchTheaterItems();
    }, []);

    const featuredItems = featuredItemData.map(v => 
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
            {
                featuredItems.length > 0 && <FeaturedSlider items={featuredItems} />
            }
            <TheaterNavBar activeCategory={activeCategory} setActiveCategory={setActiveCategory} searchInput={searchInput} setSearchInput={setSearchInput}  />
            <Schedule searchInput={searchInput} activeCategory={activeCategory} theaterItems={theaterItems}/>
        </div>
    )
}