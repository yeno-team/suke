import React from "react";
import { CategoryCard } from "@suke/suke-web/src/components/CategoryCard";
import { useCategory } from "@suke/suke-web/src/hooks/useCategory";
import numeral from "numeral";
import { Link } from "react-router-dom";
import { Navigation } from "../../common/Navigation"



export const ExplorePage = () => {
    const { getNextPage, categories, loading, sortDirection, setSortDirection} = useCategory();
    
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;

        if (bottom && !loading) { 
            getNextPage();
        }
    }
    

    return (
        <div className="bg-darkblack h-full flex flex-col flex-wrap text-center md:text-left" onScroll={handleScroll}>
            <Navigation />
            <div className="flex mt-12 mb-4 md:ml-20 font-sans">
                <h1 className="text-white text-2xl font-black">Categories</h1>
                <div className="ml-auto md:mr-20 flex">
                    <h1 className="text-white font-semibold mr-3 leading-none my-auto">Sort By</h1>
                    <select className="bg-black text-lightgray rounded text-sm p-1" value={sortDirection} onChange={(e) => setSortDirection(e.target.value as "ASC" | "DESC")}>
                        <option value="DESC">High To Low (viewers)</option>
                        <option value="ASC">Low To High (viewers)</option>
                    </select>
                </div>
            </div>
            <div className="w-full px-20 min-h-screen">
                {
                    categories.length > 0 ?
                    categories.map(v => <Link key={v.id} to={"/categories/" + v.value} ><CategoryCard key={v.id} name={v.label} viewerCount={numeral(v.viewerCount).format("0.[0]a")} imageUrl={v.thumbnail_url}></CategoryCard></Link>) :
                    <h1 className="text-white">Loading...</h1>
                }
            </div>
        </div>
    )
}