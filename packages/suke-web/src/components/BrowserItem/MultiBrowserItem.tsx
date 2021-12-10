import { IMultiStandaloneData } from "@suke/suke-core/src/entities/SearchResult";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { MultiBrowserItemProps, MultiBrowserStandaloneItemProps } from ".";
import useAuth from "../../hooks/useAuth";
import { useChannel } from "../../hooks/useChannel";
import { Button } from "../Button";
import { Request } from "@suke/suke-core/src/entities/Request";
import { UserId } from "@suke/suke-core/src/entities/UserId";

export function MultiBrowserItem({data, category, roomId, requestedBy, requestedStandalones}: MultiBrowserItemProps) {
    const [toggleEpisodes, setToggleEpisodes] = useState(false);
    const [multiItems, setMultiItems] = useState<(JSX.Element | null)[]>([]);
 
    useEffect(() => {
        const requests: Map<number, IMultiStandaloneData & {requestedBy?: string[]}> = new Map();
        
        // goes through all requests and filters out requests for the same multi into a map,
        // returns the normal multi standalones that are not requested.
        const normalItems = data.data.map(v => {
            if (requestedStandalones != null) {
                for (const requestedItem of requestedStandalones) {
                    if (requestedItem.index === v.index) {
                        const existingRequest = requests.get(v.index);
                        if (existingRequest != null) {
                            requests.set(v.index, {
                                ...existingRequest,
                                requestedBy: requestedBy
                            });
                            return null;
                        }
                        requests.set(v.index, v);
                        return null;
                    }
                }
            }
            return <MultiBrowserStandaloneItem data={data} key={v.index.toString()} standaloneData={v} roomId={roomId}></MultiBrowserStandaloneItem>
        });
        
        const requestedItems: JSX.Element[] = [];
        requests.forEach(v => requestedItems.push(<MultiBrowserStandaloneItem data={data} key={v.index.toString()} standaloneData={v} roomId={roomId} requestedBy={requestedBy}></MultiBrowserStandaloneItem>));
        
        setMultiItems([
            ...requestedItems,
            ...normalItems
        ]);
    }, [data, requestedBy, requestedStandalones, roomId])

    const toggleViewEpisodes = () => {
        setToggleEpisodes(!toggleEpisodes);
    }

    return (
        <div>
            <div className="font-sans bg-coolblack mb-2 flex m-0">
            <img src={data.thumbnail_url!} className="m-0 max-w-128 max-h-32 w-auto h-auto object-cover" alt={`${data.name} thumbnail`}></img>
            <div className="inline-block text-white align-middle m-0 ml-2 py-2 flex-grow">
                <h1 className="font-bold text-sm">{data.name?.toUpperCase()}</h1>
                <h3 className="m-0 p-0 text-xs">{category}</h3>
                {
                    requestedBy ? <h4 className="text-xs font-signika text-blue font-bold">REQUESTED BY: {requestedBy.join(", ")}</h4> : null
                }
                <Button className={classNames("m-0 mt-3 rounded-md relative")} fontWeight="semibold" size={3} fontSize="xs" backgroundColor={ toggleEpisodes ? 'red' : "blue"} onClick={toggleViewEpisodes}>
                    {
                        toggleEpisodes ?
                        "View Less" :
                        "View More"
                    }       
                </Button>
            </div>
        </div>
        <div className={classNames("flex w-full max-h-80 overflow-y-scroll", toggleEpisodes ? 'block' : 'hidden')}>
            <div className="flex flex-col w-full mr-1">
                {
                    multiItems.slice(0, multiItems.length/2+1)
                }
            </div>
            <div className="flex flex-col w-full">
                {
                    multiItems.slice(multiItems.length/2+1)
                }
            </div>
            </div>
        </div>
        
    )
}

export function MultiBrowserStandaloneItem({data, standaloneData, roomId, requestedBy}: MultiBrowserStandaloneItemProps) {
    const { createRequest, removeRequest } = useChannel();
    const { user } = useAuth();
    
    const reqObj: Request = {
        requestType: 'multi',
        requestedData: standaloneData,
        requestedMulti: data,
        requestedBy: [{
            userId: new UserId(user?.id as number),
            name: user?.name as string,
        }],
        roomId
    };

    const requestedByAuthenticatedUser = requestedBy && requestedBy.find(v => v.toLowerCase() === user?.name.toLowerCase()) != null;

    const handleRequest = () => {
        if (requestedByAuthenticatedUser) 
            return handleUndo();
        createRequest(reqObj);
    }

    const handleUndo = () => {
        removeRequest(reqObj);
    }

    return (
        <div className={classNames("relative font-sans bg-coolblack mb-2 flex m-0 cursor-pointer", requestedByAuthenticatedUser ? "hover:bg-red" : "hover:bg-blue")} onClick={handleRequest}>
            <div className="inline-block text-white align-middle m-0 ml-2 py-2 flex-grow">
                <h1 className="font-bold text-sm">{standaloneData.name?.toUpperCase()}</h1>
                {
                    requestedBy ? <h4 className="text-xs font-signika text-blue font-bold">REQUESTED BY: {requestedBy.join(", ")}</h4> : null
                }
            </div>
        </div>
    )
}