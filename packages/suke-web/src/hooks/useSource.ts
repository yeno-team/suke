import { ISearchData } from "@suke/suke-core/src/entities/SearchResult";
import { useEffect, useState } from "react";
import { getSourceList, searchSource } from "../api/source";

export const useSource = () => {
    const [sources, setSources] = useState<Array<string>>([]);

    useEffect(() => {
        async function fetchSources() {
            const list = await getSourceList();
            setSources(list);
            console.log("SOURCES, ", list)
        }  
        fetchSources();
    }, []);

    const continueSearch = (pageToken: string, engine: string, searchTerm: string): Promise<ISearchData> => {
        return searchSource({
            query: searchTerm,
            engine,
            options: {
                token: pageToken
            }
        });
    }

    return {sources, searchSource, continueSearch}
}