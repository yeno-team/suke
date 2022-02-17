import { TheaterItem } from "packages/suke-core/src/entities/TheaterItem";
import { parseFetchResponse } from "../parseFetchResponse"

export const getTheaterItems = async (): Promise<TheaterItem[]> => {
    return await parseFetchResponse(await fetch(`/api/theater/items`));
}
