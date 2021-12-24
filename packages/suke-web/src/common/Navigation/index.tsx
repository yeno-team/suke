import React, { useState } from 'react';
import classNames from 'classnames';
import { Icon } from '@iconify/react';
import { Logo } from '../../components/Logo';
import './navigation.css';
import { SearchBar } from '../../components/SearchBar';
import { MobileMenu } from './MobileMenu';
import { NotificationIcon } from '../../components/NotificationIcon';

export interface NavigationProps {
    position?: 'sticky' | 'fixed' | 'absolute' | 'relative' | 'static',
    className?: string
}

export const Navigation = ({position, className}: NavigationProps): JSX.Element => {
    const [mobileMenuActive, setMobileMenuActive] = useState(false);

    return (
        <nav className={classNames(
            position ? position : 'sticky',
            'w-screen',
            'flex',
            'items-center',
            'md:justify-between',
            'flex-wrap',
            'bg-black',
            'pt-1 md:pt-3',
            'pb-2',
            'px-4 md:px-6',
            'lg:px-8',
            className
        )}>
            <div className={classNames(
                'flex',
                'items-center',
                'mr-3'
            )}>
                <button onClick={() => setMobileMenuActive(!mobileMenuActive)} className={classNames(
                    'text-xl',
                    'text-white'
                )}>
                    <Icon icon="ant-design:menu-outlined" className={classNames('md:hidden')} />
                </button>
            </div>

            <MobileMenu active={mobileMenuActive} />

            <div className={classNames(
                'mr-2'
            )}>
                <Logo />
            </div>

            <SearchBar size="52" className={classNames(
                'md:hidden',
                'ml-3',
                'py-2'
            )} />

            <div className={classNames(
                'w-full',
                'block',
                'flex-grow',
                'md:flex',
                'md:items-center',
                'md:w-auto',
                'hidden md:block'
            )}>
                <div className={classNames(
                    'text-md',
                    'md:flex-grow'
                )}>
                    <a href="/explore" className="nav-link lg:ml-2">
                        EXPLORE
                    </a>
                    <a href="/theater" className="nav-link">
                        THEATER
                    </a>
                    <span className="nav-link mx-10">
                        <SearchBar size='64' />
                    </span>
                </div>
                
                <NotificationIcon className={classNames(
                    'mr-5'
                )} size={7} count={3} handleClick={() => {}} />

                <button className={classNames(
                    'inline-block',
                    'text-md',
                    'px-5',
                    'py-3',
                    'leading-none',
                    'rounded',
                    'bg-blue',
                    'hover:blue-100',
                    'text-white'
                )}>
                    Login
                </button>
            </div>
        </nav>
    );
}
