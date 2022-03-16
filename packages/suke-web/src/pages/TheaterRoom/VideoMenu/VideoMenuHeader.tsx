import { Icon as IconElement } from '@iconify/react'
import classNames from 'classnames'
import React from 'react'
import { useCategory } from '../../../hooks/useCategory'

export interface VideoMenuHeaderProps {
    viewerCount?: number,
    isAuthenticated?: boolean,
    title?: string;
    category?: string;
}

export const VideoMenuHeader = ({viewerCount, isAuthenticated, title, category}: VideoMenuHeaderProps) => {
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
                    <p className="text-sm font-light text-gray leading-none">{categories.find(v => v.value.toLowerCase() === category?.toLowerCase())?.label ?? "Unknown Category" }</p>
                </div>
            </span>
        </header>          
    );
};