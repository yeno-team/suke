import { Icon, Icon as IconElement } from '@iconify/react'
import classNames from 'classnames'
import React from 'react'
import { useCategory } from '../../hooks/useCategory'
import { Button } from '../Button'

export interface VideoMenuHeaderProps {
    viewerCount?: number,
    isAuthenticated?: boolean,
    isOwner?: boolean;
    title?: string;
    category?: string;
    handleOpenBrowser?: () => void;
    handleOpenSettings?: () => void;
}

export const VideoMenuHeader = ({viewerCount, handleOpenBrowser, isAuthenticated, title, category, isOwner, handleOpenSettings}: VideoMenuHeaderProps) => {
    const { categories } = useCategory();
    
    return (
        <header className={classNames(
            'w-full',
            'flex',
            'bg-coolblack',
            'px-5 py-3 lg:py-4'
        )}>
            <span className="text-red font-semibold flex-grow flex leading-none">
                <div className="font-signika inline-block lg:ml-6">
                    <p className="text-lg font-bold text-white mb-0 pb-0 leading-none inline-block lg:text-2xl lg:leading-none">{ title ?? "Untitled Video" }</p>
                    <div className="inline-block w-12 ml-2 align-text-top">
                        <IconElement className="inline-block" icon="bi:person-fill" color="#C74545"/>
                        <span className="text-sm leading-none font-sans ml-px">
                            {
                                viewerCount ? viewerCount : 0
                            }
                        </span>
                    </div>
                    <p className="text-sm font-light text-gray leading-none">{ categories.find(v => v.value.toLowerCase() === category?.toLowerCase())?.label ?? "Unknown Category" }</p>
                </div>
            </span>
            {
                isOwner && <Button onClick={handleOpenSettings} className="text-xl font-bold rounded mr-3 h-11" backgroundColor="darkgray"><Icon icon="ci:settings-filled" /><span className="ml-1 text-sm mr-1 hidden sm:block">Settings</span></Button>
            }
            {
               isAuthenticated ? <button onClick={handleOpenBrowser} className="p-2 text-sm font-bold rounded justify-self-end text-white bg-blue lg:p-3">Open Browser</button> : null 
            }
        </header>          
    )
}