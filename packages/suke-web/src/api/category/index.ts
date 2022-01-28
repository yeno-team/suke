import { parseFetchResponse } from "../parseFetchResponse"

export const getCategories = async (pageNumber = 1, limit = 20, direction: 'ASC' | 'DESC' = 'DESC') => {
    return parseFetchResponse(await fetch(`/api/categories?pageNumber=${pageNumber}&limit=${limit}&sortDirection=${direction}`));
}

export const getCategoryChannels = async (categoryVal: string, pageNumber = 1, limit = 20, direction: 'ASC' | 'DESC' = 'DESC') => {
    return parseFetchResponse(await fetch(`/api/categories/${categoryVal}/channels?pageNumber=${pageNumber}&limit=${limit}&sortDirection=${direction}`));
}