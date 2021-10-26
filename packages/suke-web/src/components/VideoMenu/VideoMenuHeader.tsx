import { Icon as IconElement } from '@iconify/react'
import classNames from 'classnames'
import React from 'react'

export interface VideoMenuHeaderProps {
    viewerCount?: number,
    handleOpenBrowser?: () => void
}

export const VideoMenuHeader = ({viewerCount, handleOpenBrowser}: VideoMenuHeaderProps) => {
    return (
        <header className={classNames(
            'container',
            'w-full',
            'flex',
            'bg-coolblack',
            'p-5 pb-3'
        )}>
            <div className="font-signika">
                <p className="text-lg font-bold text-white mb-0 pb-0 leading-none">The Flash S4 EP2</p>
                <p className="text-sm font-light text-gray leading-none">Movie Desc</p>
            </div>
            <span className="ml-2 text-red font-semibold flex-grow leading-none">
                <IconElement className="inline-block" icon="bi:person-fill" color="#C74545"/>
                
                <span className="text-sm leading-none">
                    {
                        viewerCount ? viewerCount : 0
                    }
                </span>
            </span>
            <button onClick={handleOpenBrowser} className="p-2 text-sm font-bold rounded justify-self-end text-white bg-blue">Open Browser</button>
        </header>          
    )
}