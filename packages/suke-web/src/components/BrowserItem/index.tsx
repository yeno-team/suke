import { Icon } from "@iconify/react";
import { IMultiData, IMultiStandaloneData, IStandaloneData } from "@suke/suke-core/src/entities/SearchResult";
import { UserId } from "@suke/suke-core/src/entities/UserId";
import classNames from "classnames";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useChannel } from "../../hooks/useChannel";
import { Button } from "../Button";
import { Request } from "@suke/suke-core/src/entities/Request";
import { getUrlSources } from "../../api/source";

export interface BrowserItemProps {
    key: string,
    data: IStandaloneData,
    category: string,
    roomId: string,
    activeSource: string,
    requestedBy?: string[],
    toggleModal: () => void;
}

export interface MultiBrowserItemProps {
    key: string,
    data: IMultiData,
    category: string,
    roomId: string,
    activeSource: string,
    requestedStandalones?: IMultiStandaloneData[],
    requestedBy?: string[],
    toggleModal: () => void;
}

export interface MultiBrowserStandaloneItemProps {
    key: string;
    data: IMultiData;
    roomId: string;
    category: string;
    activeSource: string;
    standaloneData: IMultiStandaloneData;
    requestedBy?: string[];
    toggleModal: () => void;
}

export function BrowserItem({data, category, roomId, requestedBy, toggleModal, activeSource}: BrowserItemProps) {
    const { createRequest, removeRequest, updateRealtimeChannelData } = useChannel();
    const { user } = useAuth();
    
    const requestObj: Request = {
        requestType: 'standalone',
        requestedData: data,
        requestedBy: [{
            userId: new UserId(user?.id as number),
                name: user?.name as string,
            }],
            roomId
    };

    const handleRequest = () => {
        createRequest(requestObj);
    }

    const handleUndoRequest = () => {
        removeRequest(requestObj)
    }

    const handleSet = () => {
        const sendRequest = async () => {
            toggleModal();
            try {
                const sources = await getUrlSources({engine: activeSource, url: data.sources[0].url})
                console.log(sources);
                updateRealtimeChannelData({
                    currentVideo: {
                        sources: sources.length > 0 ? sources : data.sources,
                        name: data.name as string,
                        category: category
                    },
                    channelId: roomId
                });
            } catch (e) {
                console.error(e);
            }
        }

        sendRequest();
    }

    const revertOrRequestButton = requestedBy && requestedBy.findIndex(v => v.toLowerCase() === user?.name.toLowerCase()) !== -1 ?
    <Button className={classNames("m-0 mt-3 rounded-md relative")} fontWeight="semibold" size={3} fontSize="xs" onClick={handleUndoRequest} backgroundColor={ "red"}>
        Revert
    </Button> :
    <Button className={classNames("m-0 mt-3 rounded-md relative")} fontWeight="semibold" size={3} fontSize="xs" onClick={handleRequest} backgroundColor={ "blue"}>
        Request  
    </Button>;

    return (
        <div className="font-sans bg-coolblack mb-2 flex m-0">
            <img src={data.thumbnail_url!} className="m-0 max-w-128 w-auto h-auto object-cover" alt={`${data.name} thumbnail`}></img>
            <div className="inline-block text-white align-middle m-0 ml-2 py-2 flex-grow">
                <h1 className="font-bold text-sm">{data.name?.toUpperCase()}</h1>
                <h3 className="m-0 p-0 text-xs">{category}</h3>
                {
                    requestedBy ? <h4 className="text-xs font-signika text-blue font-bold">REQUESTED BY: {requestedBy.join(", ")}</h4> : null
                }
                {
                     user && user.name === roomId ?
                     <Button className={classNames("m-0 mt-3 rounded-md relative")} fontWeight="semibold" size={3} fontSize="xs" onClick={handleSet} backgroundColor={"coolorange"}>
                        Set  
                     </Button>
                     : revertOrRequestButton
                }
                
            </div>
        </div>
    )
}

export * from "./MultiBrowserItem";