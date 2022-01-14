import { parseFetchResponse } from "../parseFetchResponse"

export const getCategories = async (pageNumber = 1, limit = 20) => {
    return parseFetchResponse(await fetch(`/api/categories?pageNumber=${pageNumber}&limit=${limit}`));
}
