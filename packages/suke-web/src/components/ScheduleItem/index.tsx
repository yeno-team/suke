import { ScheduleState, TheaterItemSchedule } from "@suke/suke-core/src/entities/TheaterItem"
import { useLocale } from "@suke/suke-web/src/hooks/useLocale"
import classNames from "classnames"


export interface ScheduleItemProps {
    item: TheaterItemSchedule,
    className?: string 
}

export const ScheduleItem = ({item, className}: ScheduleItemProps) => {
    const locale = useLocale();
    return (
        <div className={classNames(
            "border inline-block w-20 mt-2 mr-2 text-center p-1 px-2 rounded-full text-sm font-semibold", 
            item.state === ScheduleState.Ended && "border-darkgray text-gray line-through",
            item.state === ScheduleState.Waiting && "border-reallywhite",
            item.state === ScheduleState.Starting && "border-none bg-green text-white",
            item.state === ScheduleState.Started && "border-none bg-coolorange text-white",
            className
        )}>
            {item.time.toLocaleString(locale, { hour: 'numeric', minute: 'numeric', hour12: true })}
        </div>
    )
}