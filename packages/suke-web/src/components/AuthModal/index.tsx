import React , { useState } from "react";
import classNames from "classnames";

export type AuthModalProps = {
    className? : string
}

export type AuthModalTitle = "Login into Suke!" | "Register An Account!"

export const AuthModal = ({ className } : AuthModalProps) => {
    const [ modalTitle ] = useState<AuthModalTitle>("Login into Suke!")

    return (
        <div className={classNames(
            className,
            "absolute",
            "top-1/2",
            "left-1/2",
            "transform",
            "-translate-x-1/2",
            "-translate-y-1/2",
            "flex",
            "flex-col", 
            "bg-black",
            "h-5/6",
            "w-11/12",
            "rounded-md",
            "z-10",
        )}>
            <header className="p-3 h-1/6 rounded-t-md font-sans bg-blah bg-contain relative">
                <div className="absolute top-0 left-0 h-full w-full bg-black opacity-60"/>
                <span className="relative top-1/2 left-2 text-white text-4xl tracking-wide"> { modalTitle } </span>
            </header>
        </div>
    )
}