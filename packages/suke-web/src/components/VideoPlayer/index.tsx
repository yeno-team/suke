import { IVideoSource } from "@suke/suke-core/src/entities/SearchResult";
import React, { useMemo } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import { browserName } from 'react-device-detect';
import Hls, { HlsConfig } from "hls.js"

const serverUrl = process.env.REACT_APP_PROXY_URL || "http://localhost:4000/api/proxy/";

export const VideoPlayer = React.forwardRef((props: ReactPlayerProps & {sources: IVideoSource[], children: React.ReactNode}, ref: React.ForwardedRef<ReactPlayer>) => {

    const currentVideoSource = useMemo(() => {
       
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
                url: new URL(highestQuality.proxyRequired ? serverUrl + (highestQuality.referer ? 'referer/' + encodeURIComponent(referer as string) + "/" : "") + highestQuality.url.toString() : highestQuality.url.toString())
            } as IVideoSource;
        }
    }, [props.sources]);

    // FIX SUBTITLES
    const subtitlePloader = useMemo(() => {
        // CUSTOM LOADER ADD SUBTITLES TO HLS MANIFEST FILE AFTER LOAD 
        return class subtitlePloader extends Hls.DefaultConfig.loader {
            constructor(config: HlsConfig) {
                super(config);

                const load = this.load.bind(this);
                this.load = function (context, config, callbacks) {
                    if ((context as unknown as any).type === 'manifest') {
                        var onSuccess = callbacks.onSuccess;
                        callbacks.onSuccess = function (response, stats, context, networkDetails) {
                            const dataLines = response.data.toString().split("\n");
                            response.data = [...dataLines.slice(0,1),
                            ...currentVideoSource?.subtitles != null ? currentVideoSource?.subtitles.flatMap((v, i) => `#EXT-X-MEDIA:TYPE=SUBTITLES,GROUP-ID="subs",NAME="${v.lang}",DEFAULT=${i === 0 ? "YES" : "NO"},AUTOSELECT=${i === 0 ? "YES" : "NO"},FORCED=NO,URI="${serverUrl + v.url.toString()}",LANGUAGE="${v.lang.slice(0, 2)}"`) : "", 
                            ...dataLines.slice(1)].join("\n");
                            console.log(response.data);
                            onSuccess(response, stats, context, networkDetails);
                        };
                    }
                    load(context, config, callbacks);
                };
            }
        }
    }, [currentVideoSource?.subtitles])

    
    return <ReactPlayer {...props} children={props.children} ref={ref} url={currentVideoSource?.url.toString()} style={{backgroundColor: 'black'}} controls={true} config={{ 
        file: { 
            attributes: {
                crossOrigin: 'anonymous'
            },
            hlsOptions: {
                // pLoader: subtitlePloader,
                subtitleDisplay: true
            },
            tracks: [...currentVideoSource?.subtitles != null ? currentVideoSource!.subtitles.map((v, i) => ({kind: 'subtitles', label: v.lang, src: serverUrl + v.url.toString(), srcLang: v.lang, default: i === 0})) : []],
        }
    }}
    />
});