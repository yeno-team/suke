import { Icon } from "@iconify/react";
import classNames from "classnames";
import { Button } from "../Button";
import React from "react";

export interface BrowserSourceBtnProps {
    active?: boolean;
    children?: React.ReactNode;
    onClick?: () => void;
}

export const BrowserSourceButton = ({children, active, onClick}: BrowserSourceBtnProps) => (
    <Button fontWeight="bold" onClick={onClick} backgroundColor={ active ? 'blue': 'newblack'} className={
        classNames('block', active ? '' : 'hover:bg-opacity-75', 'block','text-base', 'py-4',)
    }>
        {children}
    </Button>
);

export interface MobileSourceButtonsProps {
    // The name of the site
    sources: string[];
    activeSource?: string;
    closeMobileMenu?: () => void;
    setActiveSource: (source: string) => void;
}


export const MobileSourceButtons = ({sources, activeSource, closeMobileMenu, setActiveSource}: MobileSourceButtonsProps) => {
    const setSource = (sourceName: string) => {
        setActiveSource(sourceName); 
        closeMobileMenu!();
    }

    const buttons = sources.map(sourceName => <BrowserSourceButton key={sourceName} onClick={() => setSource(sourceName)} active={activeSource?.toLowerCase() === sourceName.toLowerCase()}>{sourceName.toUpperCase()}</BrowserSourceButton>);

    return (
        <div className="absolute flex flex-col bg-coolblack w-full h-full z-10">
            <header className="flex">
                <Icon icon="ant-design:close-circle-outlined" onClick={closeMobileMenu} className="text-brightRed ml-auto text-2xl my-4 mr-4 cursor-pointer" />
            </header>
            {buttons}
        </div>
    )
}

export interface DesktopSourceButtonsProps {
    // The name of the site
    sources: string[];
    activeSource?: string;
    className?: string;
    setActiveSource: (source: string) => void;
}

export const DesktopSourceButtons = ({className, sources, activeSource, setActiveSource}: DesktopSourceButtonsProps) => {
    const buttons = sources.map(sourceName => <BrowserSourceButton key={sourceName} onClick={() => setActiveSource(sourceName)} active={activeSource?.toLowerCase() === sourceName.toLowerCase()}>{sourceName.toUpperCase()}</BrowserSourceButton>);
    
    return <div className={classNames("flex flex-col absolute bg-newblack h-full lg:w-56", className)}>
        {buttons}
    </div>
}
