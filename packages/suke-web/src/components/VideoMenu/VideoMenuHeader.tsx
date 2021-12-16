import { Icon as IconElement } from '@iconify/react'
import classNames from 'classnames'
import React from 'react'

export interface VideoMenuHeaderProps {
    viewerCount?: number,
    isAuthenticated?: boolean,
    title?: string;
    category?: string;
    handleOpenBrowser?: () => void
}

export const VideoMenuHeader = ({viewerCount, handleOpenBrowser, isAuthenticated, title, category}: VideoMenuHeaderProps) => {
    return (
        <header className={classNames(
            'w-full',
            'flex',
            'bg-coolblack',
            'px-5 py-3'
        )}>
            <span className="text-red font-semibold flex-grow flex leading-none">
                <div className="font-signika inline-block">
                    <p className="text-lg font-bold text-white mb-0 pb-0 leading-none inline-block">{ title ?? "Untitled Video" }</p>
                    <p className="text-sm font-light text-gray leading-none">{ category ?? "Unknown Category" }</p>
                    <div className="inline-block w-12">
                    <IconElement className="inline-block" icon="bi:person-fill" color="#C74545"/>
            
                    <span className="text-sm leading-none">
                        {
                            viewerCount ? viewerCount : 0
                        }
                    </span>
                </div>
                </div>
                
            </span>
            {
               isAuthenticated ? <button onClick={handleOpenBrowser} className="p-2 text-sm font-bold rounded justify-self-end text-white bg-blue ml-4">Open Browser</button> : null 
            }
        </header>          
    )
}