import { Button } from "../Button"



export interface TheaterCardProps {
    subheading: string;
    title: string;
    countdown: string;
    viewerCount: number;
    coverUrl: string;
}

export const TheaterCard = ({subheading, title, countdown, viewerCount, coverUrl}: TheaterCardProps) => {
    return (
        <div className="bg-no-repeat bg-cover cursor-default m-2 ml-0 py-4 px-3 h-80 w-60 inline-flex flex-col" style={{backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8) ), url('${coverUrl}')`}}>
            <div className="font-signika text-white leading-none">
                <h3 className="font-sans font-thin">{subheading}</h3>
                <h1 className="font-black text-3xl w-full">{title}</h1>
                <h4 className="font-light">STARTS IN <span className="text-blue font-bold">{countdown}</span></h4>
            </div>
            <div className="mt-auto text-center">
                <p className="text-white font-sans font-light">{viewerCount} viewers</p>
                <Button fontWeight="bold" backgroundColor="blue" className="px-8 rounded">JOIN</Button>
            </div>
        </div>
    )
}