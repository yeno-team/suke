import { Icon } from "@iconify/react"
import classNames from "classnames"
import { Circle } from "../Circle"

export interface NotificationIconProps {
    className?: string,
    count: number,
    size?: number,
    color?: string,
    handleClick: () => void
}

export const NotificationIcon = ({ count, handleClick, color, size, className }: NotificationIconProps) => {
    const CircleSize = size! - 1 > 0 ? size! - 1 : size;

    return (
        <button onClick={handleClick} className={classNames(
            color ? 'text-' + color : 'text-white',
            'relative',
            className
        )}>
            <Icon className={classNames(size ? `h-${size} w-${size}` : 'h-7 w-7')} icon="ci:notification" />
            <Circle size={size ? CircleSize : 5} fontWeight="semibold" textSize="xs" backgroundColor="brightRed" className={classNames(
                'fixed',
                'top-4',
                'ml-3'
            )}>
                {count}
            </Circle>
        </button>
    )
}