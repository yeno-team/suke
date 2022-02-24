import { TheaterItem } from "@suke/suke-core/src/entities/TheaterItem"
import { ScheduleState, TheaterItemSchedule } from "@suke/suke-core/src/entities/TheaterItemSchedule";
import { Button } from "../../components/Button";
import classNames from "classnames";
import { useMemo, useRef, useState } from "react";
import useOnClickOutside from "use-onclickoutside";
import { ScheduleItem } from "../ScheduleItem";
import { useNavigate } from "react-router-dom";

export interface TheaterItemProps {
    index: number,
    item: TheaterItem,
    schedules: TheaterItemSchedule[],
    slideTo?: (index: number) => void
}

export const TheaterItemComponent = ({index, item, schedules, slideTo}: TheaterItemProps) => {
    const [showSchedules, setShowSchedules] = useState(false);
    const navigate = useNavigate();
    const ref = useRef(null);
   
    const activeSchedule = useMemo(() => { 
        return schedules.find(v => v.state === ScheduleState.Starting || v.state === ScheduleState.Started);;
     }, [schedules]);

    const ButtonText = activeSchedule?.state === ScheduleState.Started ? "Join Late" : 
                    activeSchedule?.state === ScheduleState.Starting ? "Join Now" :
                    '';

    const show = () => setShowSchedules(true);
    const close = () => setShowSchedules(false);
    useOnClickOutside(ref, close);

    return (
        <div 
            ref={ref}
            className={classNames(
                "h-64 relative cursor-pointer transform",
                showSchedules ? "absolute z-20 w-72 md:-left-10" : 'z-10 w-56'
            )} 
            onClick={() => {!showSchedules && show(); slideTo!(Math.max(index-1, 0))}}
        >
            <div className={classNames("bg-greatblack opacity-80 w-screen absolute top-0 h-full z-0 right-0 pointer-events-none", showSchedules ? "block" : "hidden")}></div>
            <div className={classNames("bg-greatblack opacity-80 w-screen absolute top-0 h-full z-0 left-0 pointer-events-none", showSchedules ? "block" : "hidden")}></div>
            <div onClick={close} className={classNames("bg-greatblack fixed top-0 h-100 opacity-70 z-20", showSchedules ? "w-72 opacity-80" : "w-52 hover:bg-darkblack duration-200")} ></div>
            <div onClick={close} style={{backgroundImage: `url("${item.posterUrl}")`}} className={classNames("bg-no-repeat bg-cover h-full mr-10 text-center", showSchedules ? "w-72 absolute z-10" : "w-52")}>
            </div>
            <div className={classNames("absolute pointer-events-none text-white font-signika text-center transform  z-30", showSchedules ? "top-7 w-72"  : "top-1/2 -translate-y-1/2 w-52")}>
                <h1 className="text-xl font-bold select-none w-full">{item.title.toUpperCase()}</h1>
                <p className={classNames("font-light mt-px text-base select-none w-full", showSchedules ? "hidden" : "")}>{item.viewerCount} watching</p>
                <div className={classNames(showSchedules ? 'block w-full px-2' : 'hidden')}>
                    {
                        schedules.map(v => <ScheduleItem key={v.id} item={v}></ScheduleItem>)
                    }        
                </div>
            </div>
            {
                item.episode && <div className={classNames("bg-blue absolute font-signika top-0 text-xs tracking-wide px-2 py-1 font-semibold z-30 select-none", showSchedules ? "right-0" : "md:right-4 right-8")}>
                    EPISODE {item.episode}
                </div>
            }

            <Button className={classNames("absolute z-40 bottom-2 transform left-1/2 -translate-x-1/2 px-3 font-signika", showSchedules && ButtonText !== '' ? 'block' : 'hidden')} size={1} fontSize={'sm'} fontWeight="normal" backgroundColor={activeSchedule?.state === ScheduleState.Starting ? 'bettergreen' : 'coolorange'} onClick={() => navigate('/theater/' + activeSchedule?.id)}>
                {
                    ButtonText
                }
            </Button>
        </div>
    );
}