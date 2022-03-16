import { Icon } from "@iconify/react";
import { TheaterCategory } from "@suke/suke-core/src/entities/TheaterItem";
import classNames from "classnames";
import React, { useState } from "react";

export interface TheaterNavBarProps {
    searchInput: string,
    setSearchInput: (s: string) => void,
    activeCategory: TheaterCategory,
    setActiveCategory: (v: TheaterCategory) => void
}

export const TheaterNavBar = ({searchInput, setSearchInput, activeCategory, setActiveCategory}: TheaterNavBarProps) => {
    const [mobileSearchActive, setMobileSearchActive] = useState(false);
    const categoryItems = [{cat: TheaterCategory.everything, val: 'Everything'}, {cat: TheaterCategory.movie, val: 'Movies'},{cat: TheaterCategory.tvShow, val: 'TV Shows'}, {cat: TheaterCategory.anime, val: 'Anime'}];

    return (
        <div className="flex py-4 px-5 font-signika relative md:justify-center">
            <h1 className="text-reallywhite font-bold select-none my-auto text-lg">CATEGORY</h1>
            <div className="h-8 w-px mx-2 bg-darkgray my-auto md:mx-3 lg:mx-6"></div>
            <nav className="flex text-gray font-light">
                {
                    categoryItems.map(v => <div key={v.cat} className={classNames('mr-3 hover:opacity-80 cursor-pointer select-none my-auto md:mr-3 lg:mr-7', activeCategory === v.cat ? 'font-semibold text-white' : '')} onClick={() => setActiveCategory(v.cat)}>{v.val}</div>)
                }
            </nav>
            <Icon icon="ant-design:search-outlined" color="white" className="my-auto cursor-pointer md:hidden" fontSize={21} onClick={()=>setMobileSearchActive(prev => !prev)}/>
            <div className={classNames("relative hidden md:block")}>
                <input type="text" placeholder="Search Theater..." className="w-64 px-2 py-2 ml-42 font-light md:ml-20 xl:ml-110 lg:w-80" value={searchInput} onChange={e => setSearchInput(e.target.value)}/>
                <Icon icon="ant-design:search-outlined" color="gray" className="my-auto cursor-pointer absolute bottom-2 right-2" fontSize={23} onClick={()=>setMobileSearchActive(false)}/>
            </div>
            <div className={classNames("absolute right-7 bottom-2", mobileSearchActive ? 'block' : 'hidden')}>
                <input type="text" placeholder="Search Theater..." className="w-80 px-2 py-2 font-light" value={searchInput} onChange={e => setSearchInput(e.target.value)}/>
                <Icon icon="ant-design:close-circle-outlined" color="gray" className="my-auto cursor-pointer absolute bottom-2 right-2" fontSize={23} onClick={()=>setMobileSearchActive(false)}/>
            </div>
        </div>
    )
}