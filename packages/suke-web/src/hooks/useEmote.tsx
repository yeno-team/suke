import { useEffect , useState } from "react";
import { getGlobalEmotes } from "@suke/suke-web/src/api/emotes";
import { GlobalEmote } from "@suke/suke-core/src/types/GlobalEmote";

export const useEmote = (channelId : string) => {
    const [ globalEmotes , setGlobalEmotes ] = useState<Array<GlobalEmote>>([])
    const [ channelEmotes , setChannelEmotes ] = useState<unknown>([])

    useEffect(() => {
        (async() => {
            setGlobalEmotes(await getGlobalEmotes())
        })()
    } , [])

    return [ 
        globalEmotes,
        channelEmotes
    ] as const
}