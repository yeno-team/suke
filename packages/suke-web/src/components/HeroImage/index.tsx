import classNames from "classnames"
import React from "react";
export interface HeroImageProps {
    imageUrl: string;
    className?: string;
    children?: React.ReactNode;
}

export const HeroImage = ({imageUrl, className, children}: HeroImageProps) => {
    return (
        <div className={classNames(
            'flex',
            'justify-center',
            'align-middle',
            'bg-no-repeat',
            'bg-cover',
            className
        )} style={{backgroundImage: `url("${imageUrl}")`}}>
            { children }
        </div>
    )
}