import { ISearchData, IStandaloneData, StandaloneType, Quality, IMultiData, IMultiStandaloneData, IVideoSource } from "@suke/suke-core/src/entities/SearchResult";
import { Service } from "typedi";
import { IParser, ParserDataResponse, ParserSearchOptions } from "@suke/suke-core/src/entities/Parser";
import { YoutubeApiWrapper } from "@suke/wrappers/src";
import { ChannelRenderer, IHasChannelRenderer, IHasItemSectionRenderer, IHasPlaylistRenderer, IHasShelfRenderer, IHasVideoRenderer, Thumbnail, YoutubeApiSearchContinuationResponse, YoutubeApiSearchResponse } from "@suke/wrappers/src/youtube";
import { ParserError } from "@suke/suke-core/src/exceptions/ParserError";

@Service()
export class YoutubeParser implements IParser {
    name = "youtube";
    hostname: URL = new URL("https://youtube.com");

    constructor (
        private wrapper: YoutubeApiWrapper
    ) {  }

    getData(url: URL): Promise<ParserDataResponse> {
        throw new Error("Method not implemented.");
    }

    async getSource(url: URL): Promise<IVideoSource[]> {
        return [];
    }

    async search(searchTerm: string, options?: ParserSearchOptions): Promise<ISearchData> {        
        if (options?.limit != null)
            throw new ParserError("'limit' property is not supported on the Youtube Parser.");

        let searchData; 
        if (options?.token != null) {   
            searchData = await this.wrapper.continueSearch(options.token);
            return {
                results: {
                    standalone: this.extractContinuationStandalones(searchData),
                    multi: await this.extractContinuationMultis(searchData)
                },
                nextPageToken: this.wrapper.extractContinuationToken(searchData)
            };
        } else {
            searchData = await this.wrapper.search(searchTerm);

            return {
                results: {
                    standalone: this.extractStandalones(searchData),
                    multi: await this.extractMultis(searchData)
                },
                nextPageToken: this.wrapper.extractContinuationToken(searchData)
            };
        }
    }

    private extractStandalones(data: YoutubeApiSearchResponse): IStandaloneData[] {
        let standalones: IStandaloneData[] = [];
        
        for (const contents of data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents) {
            if (contents.itemSectionRenderer == null)
                continue;

            standalones = [
                ...standalones,
                ...(this.extractStandalonesFromItemSectionRenderer(contents as IHasItemSectionRenderer))
            ];
        }
        
        return standalones;
    }

    private extractContinuationStandalones(data: YoutubeApiSearchContinuationResponse): IStandaloneData[] {
        let standalones: IStandaloneData[] = [];

        for (let renderer of data.onResponseReceivedCommands[0].appendContinuationItemsAction.continuationItems) {
            if ((renderer = renderer as IHasItemSectionRenderer).itemSectionRenderer != null) {
                standalones = [
                    ...standalones,
                    ...(this.extractStandalonesFromItemSectionRenderer(renderer))
                ];
            }
        }

        return standalones;
    }

    private extractStandalonesFromItemSectionRenderer(contents: IHasItemSectionRenderer): IStandaloneData[] {
        const standalones = [];

        for (let renderer of contents.itemSectionRenderer.contents) {
            const shelfRenderer = (renderer as unknown as IHasShelfRenderer).shelfRenderer;

            if (shelfRenderer != null && shelfRenderer.content.verticalListRenderer != null) {
                for (const videoRenderer of shelfRenderer.content.verticalListRenderer.items) {
                    standalones.push({
                        id: 'youtube-' + videoRenderer.videoRenderer.videoId,
                        type: this.wrapper.isLiveStream(videoRenderer.videoRenderer) ? StandaloneType.Stream : StandaloneType.Video,
                        name: videoRenderer.videoRenderer.title.runs[0]?.text,
                        thumbnail_url: videoRenderer.videoRenderer.thumbnail.thumbnails[0].url,
                        sources: [
                            {
                                url: new URL(`https://www.youtube.com/watch?v=${videoRenderer.videoRenderer.videoId}`),
                                quality: Quality.auto
                            }
                        ]
                    });
                }
            } else if ((renderer = renderer as unknown as IHasVideoRenderer).videoRenderer != null) {
                const videoRenderer = renderer.videoRenderer;

                standalones.push({
                    id: 'youtube-' + videoRenderer.videoId,
                    type: this.wrapper.isLiveStream(videoRenderer) ? StandaloneType.Stream : StandaloneType.Video,
                    name: videoRenderer.title.runs[0]?.text,
                    thumbnail_url: videoRenderer.thumbnail.thumbnails[0].url,
                    sources: [
                        {
                            url: new URL(`https://www.youtube.com/watch?v=${videoRenderer.videoId}`),
                            quality: Quality.auto
                        }
                    ],
                });
            }
        }

        return standalones;
    }

    private async extractMultis(data: YoutubeApiSearchResponse): Promise<IMultiData[]> {
        let multis: IMultiData[] = [];
        
        for (const contents of data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents) {
            if (contents.itemSectionRenderer == null)
                continue;
                
            multis = [
                ...multis,
                ...await this.extractMultiFromItemSectionRenderer(contents as IHasItemSectionRenderer)
            ];
        }
        
        return multis;
    }

    private async extractMultiFromItemSectionRenderer(contents: IHasItemSectionRenderer) {
        const multis = [];

        for (const renderer of contents.itemSectionRenderer.contents) {
            let hasPlaylistRenderer;
            if ((hasPlaylistRenderer = renderer as unknown as IHasPlaylistRenderer).playlistRenderer != null) {
                const playlistRenderer = hasPlaylistRenderer.playlistRenderer;
                
                const highestQualityThumbnail = this.findHighestQualityThumbnail(playlistRenderer.thumbnails);
                const playlistStandaloneVideos: IMultiStandaloneData[] = [];

                const nextResp = await this.wrapper.next({playlistId: playlistRenderer.playlistId});

                for (const playlistVid of nextResp.contents.twoColumnWatchNextResults.playlist.playlist.contents) {
                    if (playlistVid.playlistPanelVideoRenderer == null)
                        continue;

                    playlistStandaloneVideos.push({
                        type: StandaloneType.Video,
                        index: playlistVid.playlistPanelVideoRenderer.navigationEndpoint.watchEndpoint.index,
                        name: playlistVid.playlistPanelVideoRenderer.title.simpleText,
                        sources: [
                            {
                                url: new URL("https://www.youtube.com/watch?v=" + playlistVid.playlistPanelVideoRenderer.videoId),
                                quality: Quality.auto
                            }
                        ]
                    });
                }

                multis.push({
                    id: 'youtubeList-' + playlistRenderer.playlistId,
                    name: playlistRenderer.title.simpleText,
                    thumbnail_url: highestQualityThumbnail ? highestQualityThumbnail.url : "",
                    data: playlistStandaloneVideos
                });
            }
        }

        return multis;
    }

    private async extractContinuationMultis(data: YoutubeApiSearchContinuationResponse): Promise<IMultiData[]> {
        let multis: IMultiData[] = [];

        for (const renderer of data.onResponseReceivedCommands[0]?.appendContinuationItemsAction.continuationItems) {
            if ((renderer as IHasItemSectionRenderer).itemSectionRenderer != null) {
                multis = [
                    ...multis,
                    ...await this.extractMultiFromItemSectionRenderer(renderer as IHasItemSectionRenderer)
                ];
            }
        }

        return multis;
    }

    private findHighestQualityThumbnail(thumbnail: Thumbnail[]) {
        let bestQuality = 0;
        let best;

        for (const val of thumbnail[0].thumbnails) {
            if (val.width + val.height > bestQuality) {
                best = val;
                bestQuality = val.width + val.height;
            }
        }

        return best;
    }

    private findChannelRenderer(data: YoutubeApiSearchResponse): ChannelRenderer | undefined {
        const foundChannelRenderer = data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents
            .find(v => v.itemSectionRenderer.contents.find(v => (v as IHasChannelRenderer).channelRenderer != null));
        
        if  (foundChannelRenderer == null) {
            return;
        }

        const channelRenderer = (foundChannelRenderer.itemSectionRenderer.contents.find(v => (v as IHasChannelRenderer).channelRenderer != null) as IHasChannelRenderer).channelRenderer;
            
        return channelRenderer;
    }
}