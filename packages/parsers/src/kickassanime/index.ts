import { ISearchResult } from "packages/suke-core/src/entities/SearchResult";
import { IParser, ParserSearchOptions } from "../IParser";

export enum KickAssAnimeServers {
    "PINK-BIRD",
    "SAPPHIRE-DUCK",
    "MAGENTA13",
    "A-KICKASSANIME",
    "THETA-ORIGINAL",
    "BETAPLAYER",
    "BETASERVER3",
    "BETA-SERVER"
}


export class KickAssAnimeParser implements IParser {
    search(searchTerm: string, options: ParserSearchOptions): ISearchResult {
        // lunatite waz here and you did not time travel bitch.
    }
}