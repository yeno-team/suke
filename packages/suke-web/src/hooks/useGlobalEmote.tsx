import { useEffect , useState } from "react";
import { getGlobalEmotes } from "@suke/suke-web/src/api/emotes";
import { GlobalEmote } from "@suke/suke-core/src/types/GlobalEmote";

export const useGlobalEmote = () => {
    const [ globalEmotes , setGlobalEmotes ] = useState<Array<GlobalEmote>>([]);
    const [ hasGlobalEmotesFetched , setHasGlobalEmotesFetched ] = useState(false);

    useEffect(() => {
        (async() => {
            try {
                setGlobalEmotes(await getGlobalEmotes())
            } catch {
                setGlobalEmotes([])
            }

            setHasGlobalEmotesFetched(true)
        })()
    } , [])

    return [ 
        globalEmotes,
        hasGlobalEmotesFetched 
    ] as const
}