import { IVideoSource } from "@suke/suke-core/src/entities/SearchResult";
import React, { useMemo } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import { browserName } from 'react-device-detect';

export const VideoPlayer = React.forwardRef((props: ReactPlayerProps & {sources: IVideoSource[], children: React.ReactNode}, ref: React.ForwardedRef<ReactPlayer>) => {

    const currentVideoSource = useMemo(() => {
        const serverUrl = process.env.REACT_APP_PROXY_URL || "http://localhost:4000/api/proxy/";
        let highestQuality: IVideoSource | undefined;
        
        for (const v of props.sources) {
            const canPlay = (v.proxyRequired ? ReactPlayer.canPlay(serverUrl + v.url.toString()) : ReactPlayer.canPlay(v.url.toString()));

            if (canPlay && highestQuality == null) {
                highestQuality = v;
                continue;
            } 

            if ((canPlay || (v.url.toString().endsWith('.mkv') && browserName === "Chrome")) && v.quality > highestQuality!.quality) {
                highestQuality = v;
            }
        }
        
        if (highestQuality != null) {
            const referer = highestQuality.referer;
            return {
                ...highestQuality,
                url: new URL(highestQuality.proxyRequired ? serverUrl + (highestQuality.referer ? 'referer/' + encodeURIComponent(referer as string) + "/" : "") + encodeURIComponent(highestQuality.url.toString()) : highestQuality.url.toString())
            } as IVideoSource;
        }
    }, [props.sources]);

    
    return <ReactPlayer {...props} children={props.children} ref={ref} url={currentVideoSource?.url.toString()} style={{backgroundColor: 'black'}} controls={true} config={{ 
        file: { 
            attributes: {
                crossOrigin: 'anonymous',
            },
            tracks: [...currentVideoSource?.subtitles != null ? currentVideoSource!.subtitles.map(v => ({kind: 'subtitles', label: v.lang, src: v.url.toString(), srcLang: v.lang})) : []],
        },
    }}
    />
});