import { Icon } from "@iconify/react"
import { IMultiData, ISearchData, IStandaloneData } from "@suke/suke-core/src/entities/SearchResult"
import classNames from "classnames"
import React, { useEffect, useState } from "react"
import { useSource } from "../../hooks/useSource"
import { BrowserItem } from "../BrowserItem"
import { Button } from "../Button"
import { Modal } from "../Modal"
import { SearchBar } from "../SearchBar"
import { MobileSourceButtons } from "./SourceButtons"

export interface BrowserProps {
    setActive: (active: boolean) => void;
}

export const Browser = ({ setActive }: BrowserProps) => {
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const {sources, searchSource} = useSource();
    const [activeSource, setActiveSource] = useState("");
    const [standalones, setStandalones] = useState<IStandaloneData[]>([]);
    const [multis, setMultis] = useState<IMultiData[]>([]);
    const [searchData, setSearchData] = useState<ISearchData>({} as ISearchData);
    const [searchInput, setSearchInput] = useState("");


    useEffect(() => {
        // default source
        if (activeSource === "" || activeSource == null) {
            setActiveSource(sources[0]);
        }  
    }, [sources, activeSource]);

    const closeMobileMenu = () => {
        setMobileMenuActive(false);
    }

    const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const getSourceData = async () => {
            const resp = await searchSource({
                engine: activeSource,
                query: searchInput
            });

            setStandalones(resp.results.standalone);
            setMultis(resp.results.multi);
            setSearchData(resp);
        }

        getSourceData();
    }

    // return a list of multi and standalone browser items where they are in an alternating order
    const getItems = () => {
        let items = [];
        let i = 0;

        for (const standalone of standalones) {
            items[i] = (<BrowserItem thumbnailUrl={standalone.thumbnail_url || ""} title={standalone.name || "Title"} category={"Category"}></BrowserItem>)
            i = i + 2;
        }

        // reset index, standalones use even-number indexes
        i = 1;
        for (const multi of multis) {
            i = i + 2;
        }

        return items;
    }

    return (
        <div className="w-screen bg-darkblack top-28 my-0 mx-auto h-full">
            <Modal active={mobileMenuActive}>
                <MobileSourceButtons closeMobileMenu={closeMobileMenu} sources={sources} activeSource={activeSource} setActiveSource={setActiveSource}/>
            </Modal>
            
            <Button fontWeight="semibold" backgroundColor="red" onClick={() => setActive(false)} className="w-full md:hidden py-4">
                Close Browser
            </Button>

            <nav className="bg-coolgray flex">
                <button>
                    <Icon icon="ant-design:menu-outlined" onClick={() => setMobileMenuActive(true)} className={classNames('text-white m-4 text-lg md:hidden')} />
                </button>
                <SearchBar value={searchInput} setValue={setSearchInput} onSubmit={onSearchSubmit} size='80' placeholder={"Search " + (activeSource ? activeSource.charAt(0).toUpperCase() + activeSource.slice(1) : "Videos") + "..."} className={classNames(
                    'md:hidden',
                    'py-2',
                )} />
            </nav>
            <div className="flex-grow bg-coolgray">
                {
                    getItems()
                }
            </div>
        </div>
    )
}