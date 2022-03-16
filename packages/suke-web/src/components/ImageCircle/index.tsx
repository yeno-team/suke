import React from "react";
import classNames from "classnames"

export interface ImageCircleProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    onClick?: () => void;
}

export const ImageCircle = ({src, alt, width, height, className, onClick}: ImageCircleProps) => {
    return (
        <img onClick={onClick} src={src} alt={alt} className={classNames(
            "rounded-full",
            width ? "w-" + width : "w-12",
            height ? "h-" + height : "h-12",
            className
        )}></img>
    )
}