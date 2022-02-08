import { TheaterItem } from "@suke/suke-core/src/entities/TheaterItem";
import classNames from "classnames";
import React from "react";
import { useMemo, useState } from "react";
import AliceCarousel from "react-alice-carousel";

export interface SectionSlidersProps {
    title: string;
    items: TheaterItem[];
    className?: string;
}

export const SectionSlidersElement = ({title, items, className}: SectionSlidersProps) => {
    const itemElements = useMemo(() => items.map(v => 
        <div className="h-64 w-56 relative">
            <div className="bg-greatblack fixed top-0 w-56 h-100 opacity-70"></div>
            <div className="bg-no-repeat bg-cover h-full w-52 mr-10 text-center" style={{backgroundImage: `url("${v.posterUrl}")`}}>

            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-signika w-40 text-center">
                <h1 className="text-xl font-bold">{v.title.toUpperCase()}</h1>
                <p className="font-light mt-px text-base">{v.viewerCount} watching</p>
            </div>
            {
                v.episode && <div className="bg-blue absolute font-signika top-0 right-4 text-xs tracking-wide px-2 py-1 font-semibold">
                    EPISODE {v.episode}
                </div>
            }
        </div>
    ), [items]);


    return (
        <div className={classNames("font-sans px-10", className)}>
            <h1 className="text-white text-lg font-bold mb-2">{title}</h1>
            <div className="text-white relative">
                
                
                <AliceCarousel 
                    items={itemElements}
                    autoWidth
                    mouseTracking
                    disableDotsControls
                    infinite
                    paddingLeft={20}
                    paddingRight={20}
                    responsive={{0: {items: 2}}}
                    renderNextButton={() => 
                        <div className="cursor-pointer transform rotate-180 top-0 select-none absolute z-10 -right-10 flex text-4xl text-center h-64 w-6 hover:bg-black bg-opacity-40"><p className="my-auto mx-auto" >&lang;</p></div>
                        
                    }
                    renderPrevButton={() => 
                        <div className="cursor-pointer select-none absolute z-10 top-0 -left-10 text-4xl h-64 w-6 flex hover:bg-black bg-opacity-80 text-center"><p className="my-auto mx-auto" >&lang;</p></div>
                    }
                />
            </div> 
        </div>
    )
}

export const SectionSliders = React.memo(SectionSlidersElement);