import { ValidationError } from "@suke/suke-core/src/exceptions/ValidationError"
import { ValueObject } from "@suke/suke-core/src/ValueObject"
import { Service } from "typedi";
import axios from "axios"

export class KickAssAnimeLink extends ValueObject {
    private linkRegex = /^(?:http(?:s|)):\/\/www(?:2|).kickassanime.ro\/anime\/(?:[a-zA-Z0-9]+-){1,}\d*(?:\/|)$/

    constructor(public url : string) {
        super()

        if(!this.IsValid()) {
            throw new ValidationError("Invalid Kickassanime URL.")
        }
    }

    public* GetEqualityProperties(): Generator<unknown, any, unknown> {
        yield this.linkRegex
    }

    public IsValid(): boolean {
        return !!this.url && this.linkRegex.test(this.url)
    }
}

export type KickAssAnimeRawEpisode = {
    epnum : string,
    name : null | string,
    slug : string,
    createddate : string,
    num : string
}

export type KickAssAnimeEpisode = {
    name : string | null,
    createddate : string,
    link : string,
    num : number
}

@Service()
export default class KickAssAnime {
    private episodesRegex = /\[{"epnum":"Episode \d+","name":.+,"slug":.+,"createddate":.+,"num":"\d+"}\]/

    public async getEpisodes(link : KickAssAnimeLink) : Promise<null | Array<KickAssAnimeEpisode>> {
        const getEpisodesReq = await axios.get(link.url)
        const html = getEpisodesReq.data

        const episodesAsString = this.episodesRegex.exec(html)

        if(episodesAsString) {
            const arrOfEpisodes : Array<KickAssAnimeRawEpisode> = JSON.parse(episodesAsString[0])
    
            return arrOfEpisodes.map(({ name , slug , createddate , num }) => ({
                name,
                createddate,
                num : +num,
                link : "https://www2.kickassanime.ro" + slug
            }))
        }
    
        return null
    }
}