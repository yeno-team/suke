import { Icon } from "@iconify/react"
import { IMultiData, IMultiStandaloneData, ISearchData, IStandaloneData } from "@suke/suke-core/src/entities/SearchResult"
import classNames from "classnames"
import React, { UIEvent, useEffect, useMemo, useState } from "react"
import { useSource } from "../../hooks/useSource"
import { BrowserItem, MultiBrowserItem } from "../BrowserItem"
import { Button } from "../Button"
import { Request } from "@suke/suke-core/src/entities/Request"
import { Modal } from "../Modal"
import { SearchBar } from "../SearchBar"
import { DesktopSourceButtons, MobileSourceButtons } from "./SourceButtons"
import { getBrowserItems } from "../../util/getBrowserItems"

export interface BrowserProps {
    setActive: (active: boolean) => void;
    active: boolean;
    requests: Request[];
    roomId: string;
}

export const Browser = ({ setActive, roomId, requests, active }: BrowserProps) => {
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const {sources, searchSource, continueSearch} = useSource();
    const [activeSource, setActiveSource] = useState("");
    const [standalones, setStandalones] = useState<IStandaloneData[]>([]);
    const [multis, setMultis] = useState<IMultiData[]>([]);
    const [searchData, setSearchData] = useState<ISearchData>({} as ISearchData);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        // default source
        if (activeSource === "" || activeSource == null) {
            setActiveSource(sources[0]);
        }  
    }, [sources, activeSource]);

    const browserElements = useMemo((): JSX.Element[] => {
        const toggleModal = () => {
            setActive(!active);
        }

        const requestedItems: Map<string, JSX.Element> = new Map();
        const multiDatas: Map<string, IMultiStandaloneData[]> = new Map();

        for (const req of requests) {
            if (req == null) continue;
            if (req.requestType === 'standalone') {
                const exists = requestedItems.get(req.requestedData.id);
                if (exists) {
                    continue;
                }

                requestedItems.set(req.requestedData.id, <BrowserItem requestedObject={req} activeSource={activeSource} toggleModal={toggleModal} key={req.requestedData.id} category="Category" roomId={roomId} data={req.requestedData} requestedBy={req.requestedBy.flatMap(r => r.name)} ></BrowserItem>);
            }

            if (req.requestType === 'multi') {
                const exists = requestedItems.get(req.requestedMulti.id);
                if (exists !== null) {
                    multiDatas.set(req.requestedMulti.id, [
                        ...(multiDatas.get(req.requestedMulti.id) ?? []),
                        req.requestedData
                    ]);
                    requestedItems.set(req.requestedMulti.id, <MultiBrowserItem requestedObject={req} activeSource={activeSource} toggleModal={toggleModal} data={req.requestedMulti} key={req.requestedMulti.id} roomId={roomId} category={"Category"} requestedBy={req.requestedBy.flatMap(r => r.name)} requestedStandalones={multiDatas.get(req.requestedMulti.id)}></MultiBrowserItem>)
                    continue;
                }

                multiDatas.set(req.requestedMulti.id, [req.requestedData]);
                requestedItems.set(req.requestedMulti.id, <MultiBrowserItem requestedObject={req} activeSource={activeSource} toggleModal={toggleModal} data={req.requestedMulti} key={req.requestedMulti.id} roomId={roomId} category={"Category"} requestedBy={req.requestedBy.flatMap(r => r.name)} requestedStandalones={multiDatas.get(req.requestedMulti.id)}></MultiBrowserItem>);
            }
        }
        
        const items = getBrowserItems(standalones, multis, roomId, requestedItems, toggleModal, activeSource);

        return [
            ...Array.from(requestedItems.values()),
            ...items
        ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [multis, standalones])

    const closeMobileMenu = () => {
        setMobileMenuActive(false);
    }

    const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (e != null && e.preventDefault != null) {
            e.preventDefault();
        }

        const getSourceData = async () => {
            try {
                setLoading(true);
                
                const resp = await searchSource({
                    engine: activeSource,
                    query: searchInput
                });

                setStandalones(resp.results.standalone);
                setMultis(resp.results.multi);
                setSearchData(resp);
            } catch (e) {
                console.warn(e);
            } finally {
                setLoading(false);
            }
        }

        getSourceData();
    }

    const continueSourceSearch = async () => {
        try {
            setLoading(true);

            if (searchData.nextPageToken != null) {
                const data = await continueSearch(searchData.nextPageToken, activeSource);
                setSearchData(data);
                setStandalones(prevStandalones => [
                    ...prevStandalones,
                    ...data.results.standalone
                ]);
                setMultis(prevMultis => [
                    ...prevMultis,
                    ...data.results.multi
                ]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
        
        if (bottom && !loading) { 
            continueSourceSearch();
        }
    }

    const handleChangeSource = (changeToSource: string) => {
        setMultis([]);
        setStandalones([]);
        setSearchData({} as ISearchData);
        setActiveSource(changeToSource);
        setSearchInput("");
    }

    return (
        <div className="w-screen h-screen bg-darkblack z-30 top-28 my-0 mx-auto flex flex-col lg:fixed lg:h-big lg:mt-4 lg:w-reallybig lg:left-1/2 lg:top-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2">
            <Modal active={mobileMenuActive}>
                <MobileSourceButtons closeMobileMenu={closeMobileMenu} sources={sources} activeSource={activeSource} setActiveSource={handleChangeSource}/>
            </Modal>
            
            <Button fontWeight="semibold" backgroundColor="red" onClick={() => setActive(false)} className="w-full py-4 lg:hidden">
                Close Browser
            </Button>

            <DesktopSourceButtons className="hidden lg:flex" sources={sources} activeSource={activeSource} setActiveSource={handleChangeSource}></DesktopSourceButtons>

            <nav className="bg-black flex">
                <button>
                    <Icon icon="ant-design:menu-outlined" onClick={() => setMobileMenuActive(true)} className={classNames('text-white m-4 text-lg lg:hidden')} />
                </button>
                <SearchBar loading={loading} value={searchInput} setValue={setSearchInput} onSubmit={onSearchSubmit} size='full' placeholder={"Search " + (activeSource ? activeSource.charAt(0).toUpperCase() + activeSource.slice(1) : "Videos") + "..."} className={classNames(
                    'py-2',
                    'mx-auto ml-3 w-9/12 lg:mx-auto lg:w-7/12',
                    "text-spaceblack",
                    'lg:ml-72'
                )} rounded/>
                <button>
                    <Icon icon="bi:x" onClick={() => setActive(false)} className={classNames('text-white m-4 text-3xl hidden lg:block')} />
                </button>
            </nav>
            <div className="lg:pl-56 flex-grow bg-black overflow-y-auto" onScroll={handleScroll}>
                {
                    browserElements
                }
                {
                    loading ?
                    <div className="flex items-center justify-center space-x-2 my-2 animate-bounce">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div> : null
                }
            </div>
        </div>
    )
}