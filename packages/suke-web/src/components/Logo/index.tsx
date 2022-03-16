import React from "react";
import logo from '../../assets/logo-x2.png';
import classNames from 'classnames';

export interface LogoProps {
    className?: string;
}

export const Logo = ({ className }: LogoProps) => {
    return (
        <img src={logo} alt="Suke's logo" className={classNames(
            'w-full h-10',
            className
        )}> 

        </img>
    )

}