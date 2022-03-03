import { ITheaterItem } from "@suke/suke-core/src/entities/TheaterItem";
import { TheaterItemComponent } from "@suke/suke-web/src/components/TheaterItemComponent";
import classNames from "classnames";
import { useMemo, useState } from "react";
import AliceCarousel from "react-alice-carousel";

export interface SectionSlidersProps {
    activeDate: Date;
    title: string;
    items: ITheaterItem[];
    className?: string;
}

export const SectionSliders = ({title, items, className, activeDate}: SectionSlidersProps) => {
    const [aliceRef, setAliceRef] = useState<AliceCarousel>();
    const itemElements = useMemo(() => items.map((v, i) => {
        const availableSchedules = v.schedules.filter(v=>new Date(v.time).getMonth() === activeDate.getMonth() && new Date(v.time).getDate() === activeDate.getDate());
        return availableSchedules.length > 0 ? <TheaterItemComponent key={i} index={i} slideTo={aliceRef?.slideTo} item={v} schedules={availableSchedules}></TheaterItemComponent> : null;
    }).filter(v => v != null), [activeDate, aliceRef?.slideTo, items]);

    return itemElements.length > 0 ? (
        <div className={classNames("font-sans px-10", className)}>
            <h1 className="text-white text-lg font-bold mb-2">{title}</h1>
            <div className="text-white relative">
                <AliceCarousel 
                    ref={ref => setAliceRef(ref!)}
                    items={itemElements}
                    autoWidth
                    disableDotsControls
                    paddingLeft={40}
                    paddingRight={80}
                    renderNextButton={() => 
                        <div className="cursor-pointer transform rotate-180 top-0 select-none absolute z-10 -right-10 flex text-4xl text-center h-64 w-6 hover:bg-black bg-opacity-40"><p className="my-auto mx-auto" >&lang;</p></div>
                    }
                    renderPrevButton={() => 
                        <div className="cursor-pointer select-none absolute z-10 top-0 -left-10 text-4xl h-64 w-6 flex hover:bg-black bg-opacity-80 text-center"><p className="my-auto mx-auto" >&lang;</p></div>
                    }
                />
            </div> 
        </div>
    ) : <div></div>
}