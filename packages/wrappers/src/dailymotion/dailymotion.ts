import { AxiosRequest } from "@suke/requests";
import { ISearchData, IStandaloneData, IVideoSource, Quality, StandaloneType } from "@suke/suke-core/src/entities/SearchResult";
import { Service } from "typedi";

@Service()
export class DailymotionApiWrapper {
    private host = "https://api.dailymotion.com/";

    constructor(
        private request: AxiosRequest
    ) {}

    public async search(searchTerm: string, pageNumber: number, limit: number): Promise<ISearchData> {
        const json = await this.request.get<any>(new URL(`https://api.dailymotion.com/videos?search=${searchTerm}&language=en&page=${pageNumber}&limit=${limit}&fields=id,title,owner,thumbnail_720_url`), {
            disableCookies: true,
            headers: {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:99.0) Gecko/20100101 Firefox/99.0"}
        });
        return {
            results: {
                standalone: json.list.map((v: any) => ({
                    type: StandaloneType.Video,
                    name: v.title,
                    id: v.id,
                    thumbnail_url: v.thumbnail_720_url,
                    initRequired: false,
                    sources: [
                        {
                            url: new URL("https://www.dailymotion.com/video/" + v.id),
                            quality: Quality.auto
                        } as IVideoSource
                    ]
                } as IStandaloneData)),
                multi: [],
            },
            nextPageToken: Buffer.from(String((pageNumber || 1) + 1)).toString('base64')
        }
    }
}