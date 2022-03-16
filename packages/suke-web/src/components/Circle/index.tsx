import React from "react";
import classNames from "classnames"

export interface CircleProps {
    className?: string,
    backgroundColor?: string,
    size?: number, 
    textSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl',
    fontWeight?: 'bold' | 'semibold' | 'normal' | 'light' | 'extrabold' | 'black',
    children?: React.ReactNode
}

export const Circle = ({children, className, backgroundColor, fontWeight, size, textSize}: CircleProps) => {
    return (
        <div className={classNames(
            'flex',
            'items-center',
            'justify-center',
            'rounded-full',
            size ? `w-${size} h-${size}` : 'w-8 h-8',
            textSize ? 'text-' + textSize : 'text-sm',
            fontWeight ? 'font-' + fontWeight : 'font-normal',
            backgroundColor ? 'bg-' + backgroundColor : 'bg-red',
            className
        )}>
            {children}
        </div>
    )
}