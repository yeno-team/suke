import { Service } from 'typedi';
import { AxiosRequest } from "@suke/requests/src/";
import { YoutubeApiSearchResponse } from './types';
import { IHasContinuationItemRenderer, INextOptions, VideoRenderer, YoutubeApiNextResponse, YoutubeApiSearchContinuationResponse } from '.';

@Service()
export class YoutubeApiWrapper {
    private _INNERTUBE_API_KEY: string;
    
    // required data to pass the preconditioned search
    private mockContext = {
        "client": {
            "hl": "en",
            "gl": "US",
            "clientName": "WEB",
            "clientVersion": "2.20211124.00.00"
        }
    };

    constructor(
        private request: AxiosRequest
    ) {
        this._INNERTUBE_API_KEY = "";
    }

    /**
     * Search for a query on Youtube
     * @param query 
     * @returns 
     */
    public async search(query: string): Promise<YoutubeApiSearchResponse> {
        const apiUrl = new URL(`https://www.youtube.com/youtubei/v1/search?key=${await this.getInnertubeApiKey()}`);

        const resp = await this.request.post<YoutubeApiSearchResponse>(apiUrl, {
            body: {
                context: this.mockContext,
                query
            },

            headers: {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:99.0) Gecko/20100101 Firefox/99.0"}
        });

        return resp;
    }   


    /**
     * Continue a search by using a continuation token
     * @param continuationToken 
     * @returns 
     */
    public async continueSearch(continuationToken: string): Promise<YoutubeApiSearchContinuationResponse> {
        const apiUrl = new URL(`https://www.youtube.com/youtubei/v1/search?key=${await this.getInnertubeApiKey()}`);
        
        const resp = await this.request.post<YoutubeApiSearchContinuationResponse>(apiUrl, {
            disableCookies: true,
            body: {
                context: this.mockContext,
                continuation: continuationToken
            }
        });
        
        return resp;
    }

    /**
     * Checks if a video renderer is a live stream through its badges
     * @param videoRenderer 
     * @returns 
     */
    public isLiveStream(videoRenderer: VideoRenderer): boolean {
        if (videoRenderer.badges == null)
            return false;

        for (const badge of videoRenderer.badges) {
            if (badge.metadataBadgeRenderer.style === "BADGE_STYLE_TYPE_LIVE_NOW")
                return true;
        }

        return false;
    }

    /**
     * Call the endpoint https://www.youtube.com/youtubei/v1/next
     * Mainly for grabbing a playlist videos
     */
    public async next(opts: INextOptions): Promise<YoutubeApiNextResponse> {
        const apiUrl = new URL(`https://www.youtube.com/youtubei/v1/next?key=${await this.getInnertubeApiKey()}`);
        
        const resp = await this.request.post<YoutubeApiNextResponse>(apiUrl, {
            disableCookies: true,
            body: {
                context: this.mockContext,
                ...opts
            }
        });

        return resp;
    }

    /**
     * Attempt to grab the continuation token from the api response, returns empty string if it could not find it
     * @param data 
     * @returns token Empty if it could not find it 
     */
    public extractContinuationToken(data: YoutubeApiSearchResponse | YoutubeApiSearchContinuationResponse): string {
        if ((data = data as YoutubeApiSearchContinuationResponse).onResponseReceivedCommands != null) {
            if (data.onResponseReceivedCommands[0] != null) {
                const foundContinuationItemRenderer = data.onResponseReceivedCommands[0].appendContinuationItemsAction.continuationItems.find(v => (v as IHasContinuationItemRenderer).continuationItemRenderer != null) as IHasContinuationItemRenderer;
                return foundContinuationItemRenderer.continuationItemRenderer.continuationEndpoint.continuationCommand.token;
            }
        } else if ((data = data as unknown as YoutubeApiSearchResponse).contents != null) {
            const continuationRenderer = data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents.find(v => (v as unknown as IHasContinuationItemRenderer).continuationItemRenderer != null) as unknown as IHasContinuationItemRenderer;
            return continuationRenderer.continuationItemRenderer.continuationEndpoint.continuationCommand.token;
        }   

        return "";
    }

    /**
     * Gets the innertube api used in the api
     * @returns string Api Key
     */
    public async getInnertubeApiKey(): Promise<string> {
        if (this._INNERTUBE_API_KEY != "")
            return this._INNERTUBE_API_KEY;

        const body = await this.request.get<string>(new URL("https://www.youtube.com/results"));

        const apiKeyRegex = /"INNERTUBE_API_KEY":"([a-zA-Z0-9_]*)"/g;
        const found = apiKeyRegex.exec(body);

        if (found == null) {
            throw new Error ("Unexpectly could not grab the Innertube Api Key.");
        }

        this._INNERTUBE_API_KEY = found[1];
        return found[1];
    }
}