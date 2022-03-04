import classNames from 'classnames';
import React , { FunctionComponent } from 'react';

export interface ButtonProps {
    className?: string;
    children?: React.ReactNode;
    color?: string;
    size?: number;
    square?: boolean;
    backgroundColor?: string;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    fontWeight?: 'lighter' | 'light' | 'normal' | 'semibold' | 'bold';
    fontSize?: 'sm' | 'base' | 'lg' | 'xl' | 'xs'
}

export const Button : FunctionComponent<ButtonProps> = ({size, disabled, square, backgroundColor, color, children, onClick, fontWeight, fontSize, className}: ButtonProps) => {
    return (
        <button onClick={disabled ? () => {} : onClick} disabled={disabled} className={classNames(
            'flex',
            'inline-flex',
            'justify-center',
            'items-center',
            disabled ? '' : 'hover:bg-opacity-75',
            size ? `px-${size} py-${square ? size : Math.max(1, size-1)}` : 'px-3 py-2',
            color ? 'text-' + color : 'text-white',
            backgroundColor ? 'bg-' + backgroundColor : 'bg-teal',
            fontWeight ? 'font-' + fontWeight : 'font-normal',
            fontSize ? 'text-' + fontSize : 'text-sm',
            disabled && 'cursor-default',
            className
        )}>
            {children}
        </button>
    );
}