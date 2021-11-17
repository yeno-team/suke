import { Icon } from '@iconify/react';
import classNames from 'classnames';

export interface SearchBarProps {
    size: string | number,
    className?: string
}

export const SearchBar = ({size, className}: SearchBarProps) => {
    return (
        <div className={classNames(
            'flex',
            'relative',
            className
        )}>
            <input className={classNames(
                'w-' + size,
                'p-3',
                'rounded',
                'bg-white',
            )} placeholder="Search..." />
            <Icon className={classNames(
                'absolute',
                'right-0',
                'mt-3.5',
                'mr-3'
            )} icon="bx:bx-search" width="21px"/>
        </div>
    )
}