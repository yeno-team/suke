import { Button } from "../Button";

export interface BrowserItemProps {
    thumbnailUrl: string,
    title: string,
    category: string
}

export function BrowserItem({ thumbnailUrl, title, category }: BrowserItemProps) {
    return (
        <div className="container font-sans">
            <div className="w-28 object-cover inline-block">
                <img src={thumbnailUrl} className="h-24" alt={`${title} thumbnail`}></img>
            </div> 
            <div className="inline-block text-white">
                <h1 className="font-bold ">{title}</h1>
                <h3>{category}</h3>
            </div>
            <Button>REQUEST</Button>
        </div>
    )
}