
export interface Thumbnail {
    thumbnails: {
        url: string,
        width: number,
        height: number
    }[]
}

export interface Title {
    simpleText: string;
}

export interface ViewCountText {
    simpleText: string;
}

export interface WatchEndpoint {
    videoId: string,
    params: string
}

export interface ChannelRenderer {
    channelId: string,
    title: Title
    thumnail: Thumbnail
}

export interface VideoRenderer {
    videoId: string,
    thumbnail: Thumbnail,
    title: {
        runs: {
            text: string
        }[]
    },
    viewCountText: ViewCountText,
    watchEndpoint: WatchEndpoint,
    badges: VideoRendererBadge[]
} 

export type VideoRendererBadge = {
    metadataBadgeRenderer: {
        style: string,
        label: string
    }
}

export interface ChildVideoRenderer {
    title: Title,
    videoId: string
}

export interface IHasChildVideoRenderer {
    childVideoRenderer: ChildVideoRenderer;
}

export interface PlaylistRenderer {
    playlistId: string,
    title: Title,
    thumbnails: Thumbnail[],
    videoCount: string,
    videos: IHasChildVideoRenderer[]
}

export interface VerticalListRenderer {
    items: IHasVideoRenderer[];
}

export interface IHasPlaylistRenderer {
    playlistRenderer: PlaylistRenderer
}

export interface ShelfRenderer {
    title: Title,
    content: {
        verticalListRenderer: VerticalListRenderer
    }
}

export interface IHasChannelRenderer {
    channelRenderer: ChannelRenderer 
}

export interface IHasShelfRenderer {
    shelfRenderer: ShelfRenderer
}

export interface IHasVideoRenderer {
    videoRenderer: VideoRenderer
}

export interface IHasContinuationItemRenderer {
    continuationItemRenderer: ContinuationItemRenderer
} 
export type ItemSectionRendererContentItem = IHasChannelRenderer | IHasShelfRenderer | IHasVideoRenderer | IHasPlaylistRenderer | IHasContinuationItemRenderer;

export interface YoutubeApiSearchResponseContentsItem {
    itemSectionRenderer: {
        contents: ItemSectionRendererContentItem[]
    }
}

export interface YoutubeApiSearchResponse {
    contents: {
        twoColumnSearchResultsRenderer: {
            primaryContents: {
                sectionListRenderer: {
                    contents: YoutubeApiSearchResponseContentsItem[]
                }
            }
        }
    }
}

// CONTINUATION SEARCH TYPES

export interface ContinuationItemRenderer {
    trigger: string,
    continuationEndpoint: {
        continuationCommand: {
            token: string
        }
    }
}


export interface IHasContinuationItemRenderer {
    continuationItemRenderer: ContinuationItemRenderer
}

export interface ItemSectionRenderer {
    contents: IHasVideoRenderer[]
}

export interface IHasItemSectionRenderer {
    itemSectionRenderer: ItemSectionRenderer
}

export interface YoutubeApiSearchContinuationResponse {
    // Looks like this only has one item in the zero-index? 
    onResponseReceivedCommands: {
        appendContinuationItemsAction: {
            continuationItems: (IHasItemSectionRenderer | IHasContinuationItemRenderer)[]
        }
    }[]
}


// https://www.youtube.com/youtubei/v1/next types

export interface PlaylistPanelVideoRenderer {
    title: Title,
    thumbnail: Thumbnail,
    navigationEndpoint: {
        watchEndpoint: {
            videoId: string,
            index: number,
            params: string
        }
    },
    videoId: string
}

export interface IHasPlaylistPanelVideoRenderer {
    playlistPanelVideoRenderer: PlaylistPanelVideoRenderer
}

export interface INextOptions {
    playlistId: string
}

export interface YoutubeApiNextResponse {
    contents: {
        twoColumnWatchNextResults: {
            playlist: {
                playlist: {
                    title: string,
                    contents: IHasPlaylistPanelVideoRenderer[]
                }
            }
        }
    }
}