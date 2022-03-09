import classNames from 'classnames';
import { IUser } from '@suke/suke-core/src/entities/User';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface MobileMenuProps {
    active: boolean,
    user?: IUser,
    handleLogout: () => void
}

export const MobileMenu = ({active, user, handleLogout}: MobileMenuProps) => {
    const navigate = useNavigate();
    return (
        <div className={classNames(
            active ? '' : 'hidden',
            'lg:hidden',
            'absolute',
            'w-full',
            'left-0',
            'top-16',
            'mobile-menu',
            'text-left'
        )}>
            <button onClick={() => navigate("/explore")} className="mobile-nav-link lg:ml-2">
                Explore
            </button>
            <button onClick={() => navigate("/theater")} className="mobile-nav-link">
                Theater
            </button>
            
            {
                user != null && user.id !== 0 ? <React.Fragment>
                    <button onClick={() => navigate("/" + user!.name)} className="mobile-nav-link" >
                        Your Channel
                    </button>
                    <button onClick={() => navigate("/my/account")} className="mobile-nav-link" >
                        Account Settings
                    </button>
                    <button onClick={handleLogout} className="mobile-nav-link w-full" >
                        Log Out
                    </button>
                </React.Fragment> :
                <a href="/login" className="mobile-nav-link" >
                    LOGIN / SIGNUP
                </a>
            }
        </div>
    )
}