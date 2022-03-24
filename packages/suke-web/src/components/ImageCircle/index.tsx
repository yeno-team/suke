import React from "react";
import classNames from "classnames"
import { Image } from "../Image";

export interface ImageCircleProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    onClick?: () => void;
    noproxy?: string;
}

export const ImageCircle = ({src, alt, noproxy, width, height, className, onClick}: ImageCircleProps) => {
    return (
        <Image onClick={onClick} src={src} noproxy={noproxy} alt={alt} crossOrigin="anonymous" className={classNames(
            "rounded-full",
            width ? "w-" + width : "w-12",
            height ? "h-" + height : "h-12",
            className
        )}></Image>
    )
}