import React from "react";
import { IMultiData, IStandaloneData } from "@suke/suke-core/src/entities/SearchResult";
import { BrowserItem, MultiBrowserItem } from "../components/BrowserItem";

/**
 * Turns Standalone/Multi data into an array of alternating order of standalones and multi JSX Elements.
 * @param standalones 
 * @param multis 
 * @param roomId 
 * @param requestedItems 
 * @returns 
 */
export const getBrowserItems = (standalones: IStandaloneData[], multis: IMultiData[], roomId: string, requestedItems: Map<string, JSX.Element>, toggleModal: () => void, activeSource: string) => {
    let items = [];
    let i = 0;
        
    for (const standalone of standalones) {
        if (requestedItems.get(standalone.id) != null) {
            continue;
        }

        if (items.find(v => v && v.key === standalone.id) != null) continue;

        items[i] = (<BrowserItem activeSource={activeSource} toggleModal={toggleModal} data={standalone} key={standalone.id} roomId={roomId} category={"Category"}></BrowserItem>)
        i = i + 2;
    }

    // reset index, multis use odd-number indexes
    i = 1;
    for (const multi of multis) {
        if (requestedItems.get(multi.id) != null) {
            continue;
        }

        if (items.find(v => v && v.key === multi.id) != null) continue;
        
        items[i] = (<MultiBrowserItem activeSource={activeSource} toggleModal={toggleModal} data={multi} key={multi.id} roomId={roomId} category={"Category"} ></MultiBrowserItem>)
        i = i + 2;
    }

    return items;
}