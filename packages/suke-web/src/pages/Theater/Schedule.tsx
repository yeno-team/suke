import { TheaterCategory, ITheaterItem } from "@suke/suke-core/src/entities/TheaterItem";
import { useLocale } from "@suke/suke-web/src/hooks/useLocale"
import { getScheduleDayNames } from "@suke/suke-web/src/util/getScheduleDayNames";
import classNames from "classnames";
import { useMemo, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { SectionSliders } from "./SectionSliders";


export interface ScheduleProps {
    theaterItems: ITheaterItem[];
    searchInput: string;
    activeCategory: TheaterCategory;
}

export const Schedule = ({searchInput, activeCategory, theaterItems}: ScheduleProps) => {
    const [activeDate, setActiveDate] = useState<Date>(new Date(Date.now()));
    const [activeIndex, setActiveIndex] = useState(0);
    const clientLocale = useLocale();

    const scheduleDayNames = useMemo(() => getScheduleDayNames(new Date(Date.now()), 30, clientLocale), [clientLocale]);

    const scheduleDayNameElements = useMemo(() => scheduleDayNames.map((v) => 
        <div key={v.date.getTime()} className={classNames("text-gray text-sm text-center border-b pb-2 hover:opacity-80", v.date.getMonth() === activeDate.getMonth() && v.date.getDate() === activeDate.getDate() ? 'border-blue text-blue font-semibold' : '')} onClick={()=>setActiveDate(v.date)}>
            <h1 className="select-none cursor-pointer">{v.name}</h1>
        </div>
    ), [activeDate, scheduleDayNames]);
    
    const items: ITheaterItem[] = useMemo(() => {
        return theaterItems.filter(v => new RegExp(`${searchInput}`, 'i').test(v.title) && (v.category === activeCategory || activeCategory === TheaterCategory.everything))
    }, [activeCategory, searchInput, theaterItems]);

    return (
        <div className="mt-5 px-5 font-sans lg:mx-1/10 xl:mx-3/20 md:justify-center h-full">
            <h1 className="text-white mb-3">Schedule Times</h1>
            <AliceCarousel
                mouseTracking
                disableDotsControls
                animationDuration={200}
                responsive={{0:{items: 4}, 875:{items:7}}}
                items={scheduleDayNameElements}
                activeIndex={activeIndex}
                renderPrevButton={(e) => <div className={classNames("absolute text-xl hover:opacity-80 -top-9 w-32 h-20 right-14 cursor-pointer select-none", e.isDisabled ? 'text-darkgray' : 'text-reallywhite')}>&larr;</div>}
                renderNextButton={(e) => <div className={classNames("absolute text-xl hover:opacity-80 -top-9 w-32 h-20 right-0 cursor-pointer select-none", e.isDisabled ? 'text-darkgray' : 'text-reallywhite')}>&rarr;</div>}
                onSlideChanged={e => setActiveIndex(e.item)}
            ></AliceCarousel>
            <SectionSliders title="New Releases" items={items} activeDate={activeDate} />
            <SectionSliders title="Now Trending" items={items} activeDate={activeDate} />
            <SectionSliders title="Reruns" items={items} activeDate={activeDate} />
        </div>
    )
}