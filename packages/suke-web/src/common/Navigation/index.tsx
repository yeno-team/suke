import React, { useState } from 'react';
import classNames from 'classnames';
import { Icon } from '@iconify/react';
import { Logo } from '../../components/Logo';
import './navigation.css';
import { SearchBar } from '../../components/SearchBar';
import { MobileMenu } from './MobileMenu';
import { NotificationIcon } from '../../components/NotificationIcon';
import { Link } from 'react-router-dom';

export interface NavigationProps {
    position?: 'sticky' | 'fixed' | 'absolute' | 'relative' | 'static',
    className?: string
}

export const Navigation = ({position, className}: NavigationProps): JSX.Element => {
    const [mobileMenuActive, setMobileMenuActive] = useState(false);

    return (
        <nav className={classNames(
            position ? position : 'sticky',
            'w-full',
            'flex',
            'items-center',
            'lg:justify-between',
            'flex-wrap',
            'bg-black',
            'pt-1 lg:pt-3',
            'pb-3',
            'px-4 lg:px-6',
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
                    <Icon icon="ant-design:menu-outlined" className={classNames('lg:hidden')} />
                </button>
            </div>

            <MobileMenu active={mobileMenuActive} />

            <div className={classNames(
                'mr-2',
                'w-20',
                'lg:mr-16'
            )}>
                <Link to="/">
                    <Logo />
                </Link>
            </div>

            <SearchBar size="36" className={classNames(
                'lg:hidden',
                'ml-3',
                'py-2'
            )} />

            <div className={classNames(
                'w-full',
                'block',
                'flex-grow',
                'lg:flex',
                'lg:items-center',
                'lg:w-auto',
                'hidden lg:block'
            )}>
                <div className={classNames(
                    'text-md',
                    'lg:flex-grow',
                    'font-sitara'
                )}>
                    <a href="/explore" className="nav-link">
                        EXPLORE
                    </a>
                    <a href="/theater" className="nav-link">
                        THEATER
                    </a>
                    <span className="nav-link mx-5">
                        <SearchBar size='128' py="2" rounded/>
                    </span>
                </div>
                
                <NotificationIcon className={classNames(
                    'mr-10'
                )} size={7} count={3} handleClick={() => {}} />

                <Link to="/login">
                    <button className={classNames(
                        'inline-block',
                        'text-md',
                        'px-5',
                        'py-3',
                        'leading-none',
                        'rounded',
                        'bg-blue',
                        'hover:blue-100',
                        'text-white',
                        'lg:px-10'
                    )}>
                        Login
                    </button>
                </Link>
                
            </div>
        </nav>
    );
}
