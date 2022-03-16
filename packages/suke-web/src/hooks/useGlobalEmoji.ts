import { useEffect , useState } from "react";
import { getGlobalEmojis } from "@suke/suke-web/src/api/emoji";
import { Emoji } from "@suke/suke-core/src/types/Emoji";

export const useGlobalEmoji = () => {
    const [ globalEmotes , setGlobalEmotes ] = useState<Array<Emoji>>([]);
    const [ hasGlobalEmotesFetched , setHasGlobalEmotesFetched ] = useState(false);

    useEffect(() => {
        (async() => {
            try {
                setGlobalEmotes(await getGlobalEmojis())
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