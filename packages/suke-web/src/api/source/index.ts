import { parseFetchResponse } from "../parseFetchResponse"
import { postWithJsonData } from "../request";
import { IParserSearchOptions, ParserDataResponse } from "@suke/suke-core/src/entities/Parser"
import { ISearchData, IVideoSource } from "@suke/suke-core/src/entities/SearchResult";

export const getSourceList = async () => {
    return parseFetchResponse(await fetch('/api/source/list'));
}

export const searchSource = async (body: {engine: string, query: string, options?: IParserSearchOptions}): Promise<ISearchData> => {
    return parseFetchResponse(await postWithJsonData('api/source/search', body));
}

export const getUrlSources = async (body: {engine: string, url: URL}): Promise<IVideoSource[]> => {
    return parseFetchResponse(await postWithJsonData('api/source/get', body));
}

export const getDataSource = async (body: {engine: string, url: URL}): Promise<ParserDataResponse> => {
    return parseFetchResponse(await postWithJsonData('api/source/getData', body));
}