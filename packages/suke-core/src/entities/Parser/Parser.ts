import { IMultiData, ISearchData, IStandaloneData, IVideoSource } from "@suke/suke-core/src/entities/SearchResult";
import { ValueObject } from "@suke/suke-core/src/ValueObject";

export interface IParserSearchOptions {
  token?: string,
  limit?: number
}

export class ParserSearchOptions extends ValueObject implements IParserSearchOptions {
    token?: string | undefined;
    limit?: number;
    
    constructor(options : IParserSearchOptions) {
        super();
        
        this.token = options.token;
        this.limit = options.limit;
    } 

    protected *GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        yield;
        return;
    }

    protected IsValid(): boolean {
        throw new Error("Method not implemented.");
    }
}

export type ParserDataResponse = {multi: true, data: IMultiData} | {multi: false, data: IStandaloneData};

export interface IParser {
    /**
     * Unique Parser Name
     * Most likely use the domain name of the site, that way we have unique keys for the parsers.
     */
    name: string; 
    hostname: URL;

    search(searchTerm: string, options?: ParserSearchOptions): Promise<ISearchData>;

    // get source if required for an engine. This method should return an empty array if grabbing the sources is not required.
    getSource(url: URL): Promise<IVideoSource[]>;

    getData(url: URL, opts?: {season?: number,  episode?: number}): Promise<ParserDataResponse | undefined>;
}