import { Icon } from '@iconify/react';
import classNames from 'classnames';
import React from 'react';

export interface SearchBarProps {
    size: string | number,
    className?: string,
    placeholder?: string,
    value?: string,
    setValue?: (val: string) => void,
    onSubmit?: React.FormEventHandler<HTMLFormElement>
}

export const SearchBar = ({size, className, placeholder, onSubmit, value, setValue}: SearchBarProps) => {
    return (
        <form className={classNames(
            'flex',
            'relative',
            'w-' + size,
            className
        )} onSubmit={onSubmit}>
            <input className={classNames(
                'w-' + size,
                'p-3',
                'rounded',
                'bg-white',
            )} placeholder={placeholder ? placeholder : "Search..."} value={value} onChange={(e) => setValue!(e.target.value)} />
            <Icon className={classNames(
                'absolute',
                'right-0',
                'mt-3.5',
                'mr-3'
            )} icon="bx:bx-search" width="21px"/>
        </form>
    )
}