import { parseFetchResponse } from "../parseFetchResponse"
import { postWithJsonData } from "../request";
import { IParserSearchOptions } from "@suke/suke-core/src/entities/Parser"
import { ISearchData } from "@suke/suke-core/src/entities/SearchResult";

export const getSourceList = async () => {
    return parseFetchResponse(await fetch('/api/source/list'));
}

export const searchSource = async (body: {engine: string, query: string, options?: IParserSearchOptions}): Promise<ISearchData> => {
    return parseFetchResponse(await postWithJsonData('api/source/search', body));
}