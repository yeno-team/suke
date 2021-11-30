import { ISearchData } from "@suke/suke-core/src/entities/SearchResult";
import { ValueObject } from "@suke/suke-core/src/ValueObject";

export interface IParserSearchOptions {
  token?: string,
  pageNumber?: number,
  limit?: number
}

export class ParserSearchOptions extends ValueObject implements IParserSearchOptions {
    token?: string | undefined;
    pageNumber?: number;
    limit?: number;
    
    constructor(options : IParserSearchOptions) {
        super();
        
        this.token = options.token;
        this.pageNumber = options.pageNumber;
        this.limit = options.pageNumber;
    } 

    protected *GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        yield;
        return;
    }

    protected IsValid(): boolean {
        throw new Error("Method not implemented.");
    }
}

export interface IParser {
    /**
     * Unique Parser Name
     * Most likely use the domain name of the site, that way we have unique keys for the parsers.
     */
    name: string; 
    hostname: URL;

    search(searchTerm: string, options: ParserSearchOptions): Promise<ISearchData>;
}