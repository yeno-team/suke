import classNames from "classnames"
import React from "react";
import { useNavigate } from "react-router-dom"
import { Button } from "../Button"



export interface TheaterCardProps {
    scheduleId: number,
    subheading: string;
    title: string;
    viewerCount: string;
    coverUrl: string;
}

export const TheaterCard = ({subheading, title, scheduleId, viewerCount, coverUrl}: TheaterCardProps) => {
    const navigate = useNavigate();
    return (
        <div className="bg-no-repeat bg-cover cursor-default m-2 ml-0 py-4 px-3 h-80 w-60 inline-flex flex-col" style={{backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8) ), url('${coverUrl}')`}}>
            <div className="font-signika text-white leading-none">
                <h3 className="font-sans font-thin text-sm mb-0 leading-none">{subheading || "MOVIE"}</h3>

                <h1 className={classNames("font-black text-3xl w-full")}>{title}</h1>
            </div>
            <div className="mt-auto text-center">
                <p className="text-white font-sans font-light">{viewerCount} viewers</p>
                <Button fontWeight="bold" backgroundColor="blue" className="px-8 rounded" onClick={() => navigate(`/theater/${scheduleId}`)}>JOIN</Button>
            </div>
        </div>
    )
}