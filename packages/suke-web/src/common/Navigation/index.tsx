import React, { useState } from 'react';
import classNames from 'classnames';
import { Icon } from '@iconify/react';
import { Logo } from '../../components/Logo';
import './navigation.css';
import { SearchBar } from '../../components/SearchBar';
import { MobileMenu } from './MobileMenu';
import { NotificationIcon } from '../../components/NotificationIcon';
import { Link, useNavigate } from 'react-router-dom';
import { useScreenSize } from '@suke/suke-web/src/hooks/useScreenSize';
import useAuth from '@suke/suke-web/src/hooks/useAuth';
import { ImageCircle } from '@suke/suke-web/src/components/ImageCircle';
import { logout } from '@suke/suke-web/src/api/auth';

export interface NavigationProps {
    position?: 'sticky' | 'fixed' | 'absolute' | 'relative' | 'static',
    className?: string
}

export const Navigation = ({position, className}: NavigationProps): JSX.Element => {
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [userDropdownActive, setUserDropdownActive] = useState(false);
    const [searchVal, setSearchVal] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();
    const isLoggedIn = user != null && user.id !== 0;
    const screen = useScreenSize();

    const handleLogout = () => {
        const sendRequest = async () => {
            await logout();
            window.location.href = "/";
        }

        sendRequest();
    }

    const handleSearch = (e: any) => {
        e.preventDefault();
        navigate("/search/" + searchVal)
    }

    return (
        <nav className={classNames(
            position ? position : 'sticky',
            'w-full',
            'flex',
            'items-center',
            'lg:justify-between',
            'flex-wrap',
            'bg-newblack',
            'pt-2 lg:pt-3',
            'pb-4',
            'px-4 lg:px-6',
            'lg:px-8 z-20',
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

            <MobileMenu active={mobileMenuActive} user={user} handleLogout={handleLogout} />
            
            <div className={classNames(
                'mr-2',
                'w-20',
                'lg:mr-16'
            )}>
                <Link to="/">
                    <Logo />
                </Link>
            </div>

            <SearchBar size={screen.width < 1300 ? '52' : '128'} py="2" value={searchVal} setValue={setSearchVal} onSubmit={handleSearch} rounded className={classNames(
                'lg:hidden',
                'ml-3',
                'text-coolblack'
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
                        <SearchBar size={screen.width < 1300 ? '64' : '128'} py="2" rounded onSubmit={handleSearch} value={searchVal} setValue={setSearchVal} className="text-coolblack"/>
                    </span>
                </div>
                
                <NotificationIcon className={classNames(
                    'mr-12'
                )} size={7} count={3} handleClick={() => {}} />

                {
                    isLoggedIn ?
                    <ImageCircle className="ml-auto mr-6 cursor-pointer" width={10} height={10} src="https://picsum.photos/200/300" alt="profile picture" onClick={() => setUserDropdownActive(prev => !prev)} />
                    :
                    <Link to="/login" className="ml-auto mr-6">
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
                }

                <div className={classNames("flex-col bg-coolblack py-2 absolute z-50 w-48 text-center font-sans right-16 select-none top-16 text-white", userDropdownActive ? 'flex' : 'hidden')}>
                    <div className="py-2 w-full hover:bg-newblack cursor-pointer" onClick={() => navigate("/" + user!.name)}>Your Channel</div>
                    <div className="py-2 w-full hover:bg-newblack cursor-pointer" onClick={() => navigate('/my/account')}>Account Settings</div>
                    <div className="py-2 w-full hover:bg-newblack cursor-pointer" onClick={() => handleLogout()}>Log Out</div>
                </div>
            </div>
        
        </nav>
    );
}
