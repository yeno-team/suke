import { TheaterCategory, TheaterItem } from "@suke/suke-core/src/entities/TheaterItem";
import { ScheduleState } from "@suke/suke-core/src/entities/TheaterItemSchedule";
import { useLocale } from "@suke/suke-web/src/hooks/useLocale"
import { getScheduleDayNames } from "@suke/suke-web/src/util/getScheduleDayNames";
import classNames from "classnames";
import { useMemo, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { SectionSliders } from "./SectionSliders";


export interface ScheduleProps {
    searchInput: string;
    activeCategory: TheaterCategory;
}

export const Schedule = ({searchInput, activeCategory}: ScheduleProps) => {
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
                time: (() => {const d = new Date(Date.now());d.setHours(3);return d})(),
                subscribed: [],
                state: ScheduleState.Ended,
                item: {} as TheaterItem
            },
            {
                id: 1,
                time: (() => {const d = new Date(Date.now());d.setHours(6);return d})(),
                subscribed: [],
                state: ScheduleState.Ended,
                item: {} as TheaterItem
            },
            {
                id: 2,
                time: (() => {const d = new Date(Date.now());d.setHours(8);return d})(),
                subscribed: [],
                state: ScheduleState.Starting,
                item: {} as TheaterItem
            },
            {
                id: 3,
                time: (() => {const d = new Date(Date.now());d.setHours(10);return d})(),
                subscribed: [],
                state: ScheduleState.Waiting,
                item: {} as TheaterItem
            },
            {
                id: 4,
                time: (() => {const d = new Date(Date.now());d.setHours(14);return d})(),
                subscribed: [],
                state: ScheduleState.Waiting,
                item: {} as TheaterItem
            },
            {
                id: 5,
                time: (() => {const d = new Date(Date.now());d.setHours(17);return d})(),
                subscribed: [],
                state: ScheduleState.Waiting,
                item: {} as TheaterItem
            },
            {
                id: 6,
                time: (() => {const d = new Date(Date.now());d.setHours(20);return d})(),
                subscribed: [],
                state: ScheduleState.Waiting,
                item: {} as TheaterItem
            },
            {
                id: 7,
                time: (() => {const d = new Date(Date.now());d.setHours(d.getHours()+18);return d})(),
                subscribed: [],
                state: ScheduleState.Waiting,
                item: {} as TheaterItem
            },
            {
                id: 8,
                time: (() => {const d = new Date(Date.now());d.setDate(d.getDate()+1);d.setHours(3);return d})(),
                subscribed: [],
                state: ScheduleState.Waiting,
                item: {} as TheaterItem
            },
            {
                id: 9,
                time: (() => {const d = new Date(Date.now());d.setDate(d.getDate()+1);d.setHours(6);return d})(),
                subscribed: [],
                state: ScheduleState.Waiting,
                item: {} as TheaterItem
            },
            {
                id: 10,
                time: (() => {const d = new Date(Date.now());d.setDate(d.getDate()+1);d.setHours(8);return d})(),
                subscribed: [],
                state: ScheduleState.Waiting,
                item: {} as TheaterItem
            }
        ];

        const placeholderSchedules2 = [
            {
                id: 0,
                time: (() => {const d = new Date(Date.now());d.setHours(3);return d})(),
                subscribed: [],
                state: ScheduleState.Ended,
                item: {} as TheaterItem
            },
            {
                id: 1,
                time: (() => {const d = new Date(Date.now());d.setHours(6);return d})(),
                subscribed: [],
                state: ScheduleState.Ended,
                item: {} as TheaterItem
            },
            {
                id: 2,
                time: (() => {const d = new Date(Date.now());d.setHours(8);return d})(),
                subscribed: [],
                state: ScheduleState.Started,
                item: {} as TheaterItem
            },
            {
                id: 3,
                time: (() => {const d = new Date(Date.now());d.setHours(10);return d})(),
                subscribed: [],
                state: ScheduleState.Waiting,
                item: {} as TheaterItem
            },
            {
                id: 4,
                time: (() => {const d = new Date(Date.now());d.setHours(14);return d})(),
                subscribed: [],
                state: ScheduleState.Waiting,
                item: {} as TheaterItem
            },
            {
                id: 5,
                time: (() => {const d = new Date(Date.now());d.setHours(17);return d})(),
                subscribed: [],
                state: ScheduleState.Waiting,
                item: {} as TheaterItem
            },
            {
                id: 6,
                time: (() => {const d = new Date(Date.now());d.setHours(20);return d})(),
                subscribed: [],
                state: ScheduleState.Waiting,
                item: {} as TheaterItem
            },
            {
                id: 7,
                time: (() => {const d = new Date(Date.now());d.setHours(d.getHours()+18);return d})(),
                subscribed: [],
                state: ScheduleState.Waiting,
                item: {} as TheaterItem
            },
            {
                id: 8,
                time: (() => {const d = new Date(Date.now());d.setDate(d.getDate()+1);d.setHours(3);return d})(),
                subscribed: [],
                state: ScheduleState.Waiting,
                item: {} as TheaterItem
            },
            {
                id: 9,
                time: (() => {const d = new Date(Date.now());d.setDate(d.getDate()+1);d.setHours(6);return d})(),
                subscribed: [],
                state: ScheduleState.Waiting,
                item: {} as TheaterItem
            },
            {
                id: 10,
                time: (() => {const d = new Date(Date.now());d.setDate(d.getDate()+1);d.setHours(8);return d})(),
                subscribed: [],
                state: ScheduleState.Waiting,
                item: {} as TheaterItem
            }
        ];
        
        return [
            {
                title: 'Spider-Man: No way home',
                id: 0,
                viewerCount: 523,
                posterUrl: "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_FMjpg_UX1000_.jpg",
                followers: [],
                category: TheaterCategory.Movie,
                schedules: placeholderSchedules,
                featured: true
            },
            {
                title: 'Daredevil Season 8',
                id: 1,
                viewerCount: 83,
                posterUrl: "https://www.themoviedb.org/t/p/original/c4lulIeTZxPh4xqOcUNH5qlZVpx.jpg",
                episode: 4,
                followers: [],
                category: TheaterCategory.TvShow,
                schedules: placeholderSchedules2,
                featured: false
            },
            {
                title: 'One Piece',
                id: 2,
                posterUrl: "https://www.u-buy.jp/productimg/?image=aHR0cHM6Ly9tLm1lZGlhLWFtYXpvbi5jb20vaW1hZ2VzL0kvODFXMDNCa3NFakwuX0FDX1NMMTUwMF8uanBn.jpg",
                viewerCount: 43,
                episode: 1003,
                followers: [],
                category: TheaterCategory.Anime,
                schedules: placeholderSchedules,
                featured: false
            },
            {
                title: 'The 100 Season 6',
                id: 3,
                posterUrl: "https://i.ebayimg.com/images/g/KX0AAOSw8RxfZXFO/s-l300.jpg",
                viewerCount: 52,
                episode: 12,
                followers: [],
                category: TheaterCategory.TvShow,
                schedules: placeholderSchedules2,
                featured: false
            },
            {
                title: 'Attack On Titan: Final Season',
                id: 4,
                posterUrl: "https://www.denofgeek.com/wp-content/uploads/2020/09/Attack-on-Titan-Season-4-Poster.jpg?resize=725,1024",
                viewerCount: 109,
                episode: 6,
                followers: [],
                category: TheaterCategory.Anime,
                schedules: placeholderSchedules,
                featured: false
            },
            {
                title: 'Uncharted',
                id: 5,
                posterUrl: "https://assets-prd.ignimgs.com/2022/01/13/uncharted-poster-full-1642086040683.jpg",
                viewerCount: 52,
                followers: [],
                category: TheaterCategory.Movie,
                schedules: placeholderSchedules2,
                featured: true
            },
            {
                title: 'Sonic The Hedgehog 2',
                id: 6,
                posterUrl: "https://m.media-amazon.com/images/M/MV5BMzExMWVjODMtYjgzOC00ZDljLTgxMTktYWQ0NGNiOTcxNGYxXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
                viewerCount: 17,
                followers: [],
                category: TheaterCategory.Movie,
                schedules: placeholderSchedules,
                featured: false
            },
        ].filter(v => new RegExp(`${searchInput}`, 'i').test(v.title) && (v.category === activeCategory || activeCategory === TheaterCategory.Everything))
    }, [activeCategory, searchInput]);

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