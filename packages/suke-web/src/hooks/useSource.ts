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



    return {sources, searchSource}
}