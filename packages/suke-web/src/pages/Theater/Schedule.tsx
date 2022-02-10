import { ScheduleState, TheaterItem } from "@suke/suke-core/src/entities/TheaterItem";
import { useLocale } from "@suke/suke-web/src/hooks/useLocale"
import { getScheduleDayNames } from "@suke/suke-web/src/util/getScheduleDayNames";
import classNames from "classnames";
import { useMemo, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { SectionSliders } from "./SectionSliders";


export interface ScheduleProps {
    searchInput: string;
}

export const Schedule = ({searchInput}: ScheduleProps) => {
    const [activeDate, setActiveDate] = useState<Date>(new Date(Date.now()));
    const [activeIndex, setActiveIndex] = useState(0);
    const clientLocale = useLocale();

    const scheduleDayNames = useMemo(() => getScheduleDayNames(new Date(Date.now()), 30, clientLocale), [clientLocale]);

    const scheduleDayNameElements = useMemo(() => scheduleDayNames.map((v) => 
        <div key={v.date.getTime()} className={classNames("text-gray text-sm text-center border-b pb-2 hover:opacity-80", v.date.getMonth() === activeDate.getMonth() && v.date.getDate() === activeDate.getDate() ? 'border-blue text-blue font-semibold' : '')} onClick={()=>setActiveDate(v.date)}>
            <h1 className="select-none cursor-pointer">{v.name}</h1>
        </div>
    ), [activeDate, scheduleDayNames]);
    
    const items: TheaterItem[] = useMemo(() => {
        const placeholderSchedules = [
            {
                id: 0,
                time: (() => {const d = new Date(Date.now());d.setHours(d.getHours()+3);return d})(),
                subscribed: [],
                state: ScheduleState.Ended
            },
            {
                id: 1,
                time: (() => {const d = new Date(Date.now());d.setHours(d.getHours()+6);return d})(),
                subscribed: [],
                state: ScheduleState.Ended
            },
            {
                id: 2,
                time: (() => {const d = new Date(Date.now());d.setHours(d.getHours()+9);return d})(),
                subscribed: [],
                state: ScheduleState.Starting
            },
            {
                id: 3,
                time: (() => {const d = new Date(Date.now());d.setHours(d.getHours()+12);return d})(),
                subscribed: [],
                state: ScheduleState.Started
            },
            {
                id: 4,
                time: (() => {const d = new Date(Date.now());d.setHours(d.getHours()+15);return d})(),
                subscribed: [],
                state: ScheduleState.Waiting
            },
            {
                id: 5,
                time: (() => {const d = new Date(Date.now());d.setHours(d.getHours()+18);return d})(),
                subscribed: [],
                state: ScheduleState.Waiting
            }
        ];
        
        return [
            {
                title: 'Spider-Man: No way home',
                id: 0,
                viewerCount: 523,
                posterUrl: "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_FMjpg_UX1000_.jpg",
                followers: [],
                schedules: placeholderSchedules
            },
            {
                title: 'Daredevil Season 8',
                id: 1,
                viewerCount: 83,
                posterUrl: "https://www.themoviedb.org/t/p/original/c4lulIeTZxPh4xqOcUNH5qlZVpx.jpg",
                episode: 4,
                followers: [],
                schedules: placeholderSchedules
            },
            {
                title: 'One Piece',
                id: 2,
                posterUrl: "https://www.u-buy.jp/productimg/?image=aHR0cHM6Ly9tLm1lZGlhLWFtYXpvbi5jb20vaW1hZ2VzL0kvODFXMDNCa3NFakwuX0FDX1NMMTUwMF8uanBn.jpg",
                viewerCount: 43,
                episode: 1003,
                followers: [],
                schedules: placeholderSchedules
            },
            {
                title: 'The 100 Season 6',
                id: 3,
                posterUrl: "https://i.ebayimg.com/images/g/KX0AAOSw8RxfZXFO/s-l300.jpg",
                viewerCount: 52,
                episode: 12,
                followers: [],
                schedules: placeholderSchedules
            },
            {
                title: 'Attack On Titan: Final Season',
                id: 4,
                posterUrl: "https://www.denofgeek.com/wp-content/uploads/2020/09/Attack-on-Titan-Season-4-Poster.jpg?resize=725,1024",
                viewerCount: 109,
                episode: 6,
                followers: [],
                schedules: placeholderSchedules
            }
        ].filter(v => new RegExp(`${searchInput}`, 'i').test(v.title))
    }, [searchInput]);


    return (
        <div className="mt-5 px-5 font-sans lg:mx-1/10 xl:mx-2/10 md:justify-center h-full">
            <h1 className="text-white mb-3">Schedule Times</h1>
            <AliceCarousel
                mouseTracking
                disableDotsControls
                animationDuration={200}
                responsive={{0:{items: 4}, 875:{items:7}}}
                items={scheduleDayNameElements}
                activeIndex={activeIndex}
                onSlideChanged={e => setActiveIndex(e.item)}
            ></AliceCarousel>
            <SectionSliders title="New Releases" items={items} activeDate={activeDate} />
            <SectionSliders title="Now Trending" items={items} activeDate={activeDate} />
            <SectionSliders title="Reruns" items={items} activeDate={activeDate} />
        </div>
    )
}