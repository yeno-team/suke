import classNames from "classnames"

export interface ImageCircleProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
}

export const ImageCircle = ({src, alt, width, height, className}: ImageCircleProps) => {
    return (
        <img src={src} alt={alt} className={classNames(
            "rounded-full",
            width ? "w-" + width : "w-12",
            height ? "h-" + height : "h-12",
            className
        )}></img>
    )
}