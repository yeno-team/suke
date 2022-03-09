import classNames from 'classnames';

export interface MobileMenuProps {
    active: boolean
}

export const MobileMenu = ({active}: MobileMenuProps) => {
    return (
        <div className={classNames(
            active ? '' : 'hidden',
            'lg:hidden',
            'absolute',
            'w-full',
            'left-0',
            'top-16',
            'mobile-menu'
        )}>
            <a href="/explore" className="mobile-nav-link lg:ml-2">
                EXPLORE
            </a>
            <a href="/theater" className="mobile-nav-link">
                THEATER
            </a>
            <a href="/login" className="mobile-nav-link" >
                LOGIN / SIGNUP
            </a>
        </div>
    )
}