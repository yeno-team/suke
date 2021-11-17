import classNames from "classnames"

export interface ImageCircleProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
}

export const ImageCircle = ({src, alt, width, height}: ImageCircleProps) => {
    return (
        <img src={src} alt={alt} className={classNames(
            "rounded-full",
            width ? "w-" + width : "w-12",
            height ? "h-" + height : "h-12"
        )}></img>
    )
}