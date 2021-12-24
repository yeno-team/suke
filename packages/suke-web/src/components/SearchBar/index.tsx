import { Icon } from '@iconify/react';
import classNames from 'classnames';
import React from 'react';

export interface SearchBarProps {
    size: string | number,
    className?: string,
    placeholder?: string,
    value?: string,
    loading?: boolean,
    setValue?: (val: string) => void,
    onSubmit?: React.FormEventHandler<HTMLFormElement>
}

export const SearchBar = ({size, className, placeholder, onSubmit, value, setValue, loading}: SearchBarProps) => {
    return (
        <form className={classNames(
            'flex',
            'relative',
            className
        )} onSubmit={onSubmit}>
            <input className={classNames(
                'w-' + size,
                'p-3',
                'rounded',
                'bg-white',
            )} placeholder={placeholder ? placeholder : "Search..."} value={value} onChange={(e) => setValue!(e.target.value)} />
            {
                !loading ?
                <Icon onClick={() => onSubmit!({} as React.FormEvent<HTMLFormElement>)} className={classNames(
                    'absolute',
                    'right-0',
                    'mt-3.5',
                    'mr-3',
                    'cursor-pointer'
                )} icon="bx:bx-search" width="21px"/> :
                <Icon className={classNames(
                    'absolute',
                    'right-0',
                    'mt-3.5',
                    'mr-3',
                    'animate-spin'
                )} icon="mdi:loading" width="21px"/>
            }
        </form>
    )
}