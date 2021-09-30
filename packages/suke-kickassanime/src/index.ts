import { ValidationError } from "@suke/suke-core/src/exceptions/ValidationError"
import { ValueObject } from "@suke/suke-core/src/ValueObject"
import axios from "axios"

export class KickAssAnimeLink extends ValueObject {
    private linkRegex = /^(?:http(?:s|)):\/\/www(?:2|).kickassanime.ro\/anime\/(?:[a-zA-Z0-9]+-){1,}\d*(?:\/|)$/

    constructor(public url : string) {
        super()

        if(!this.IsValid()) {
            throw new ValidationError("Invalid Kickassanime URL.")
        }
    }

    protected* GetEqualityProperties(): Generator<unknown, any, unknown> {
        yield this.linkRegex
    }

    protected IsValid(): boolean {
        return !!this.url && this.linkRegex.test(this.url)
    }
}

export type KickAssAnimeEpisode = {
    epnum : string,
    name : null | string,
    slug : string,
    createddate : string,
    num : string
}

async function getEpisodes(kickAssAnimeLink : KickAssAnimeLink) {
    kickAssAnimeLink.Equals
    const getEpisodesReq = await axios.get(kickAssAnimeLink.url)
    const html = getEpisodesReq.data

    const episodesInStr = /(\[{"epnum":"Episode \d*",.+\]),"types"/.exec(html)

    if(episodesInStr) {
        const arrOfEpisodes : Array<KickAssAnimeEpisode>= JSON.parse(episodesInStr[1])

        return arrOfEpisodes.map(({ name , slug , createddate , num }) => ({
            name,
            createddate,
            link : "https://www2.kickassanime.ro" + slug,
            epNum : num
        }))
    }

    return null
}