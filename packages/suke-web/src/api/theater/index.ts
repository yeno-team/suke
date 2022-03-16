import { ITheaterItem } from "@suke/suke-core/src/entities/TheaterItem";
import { ITheaterItemSchedule } from "@suke/suke-core/src/entities/TheaterItemSchedule";
import { parseFetchResponse } from "../parseFetchResponse"
import { postWithJsonData, requestWithJsonData } from "../request";

export const getTheaterItems = async (id?: number, featured?: boolean): Promise<ITheaterItem[]> => {
    return await parseFetchResponse(await fetch(`/api/theater/${id != null ? "item/"+id : "items"}`));
}

export const getScheduleItems = async (id?: number): Promise<ITheaterItemSchedule[]> => {
    return await parseFetchResponse(await fetch(`/api/theater/${id != null ? "schedule/"+id : "schedules"}`));
}

export const createTheaterItem = async (item: Omit<ITheaterItem, 'id' | 'followers' | 'viewerCount' | 'schedules'>) => {
    return parseFetchResponse(await postWithJsonData('/api/theater/item', item));
}

export const createScheduleItem = async (item: Omit<ITheaterItemSchedule, 'id' | 'item'>, itemId: number, items?: {item: Omit<ITheaterItemSchedule, 'id' | 'item'>}[]) => {
    return parseFetchResponse(await postWithJsonData('/api/theater/schedule', {...item, time: item.time.getTime(), itemId, items: items && items?.flatMap(v => ({...v, time: v.item.time.getTime()}))}));
}

export const editTheaterItem = async (id: number, item: Partial<ITheaterItem>) => {
    return parseFetchResponse(await requestWithJsonData('/api/theater/item/' + id, item, {'method': 'PATCH'}));
}

export const editScheduleItem = async (id: number, item: Partial<ITheaterItemSchedule>) => {
    return parseFetchResponse(await requestWithJsonData('/api/theater/schedule/' + id, item, {'method': 'PATCH'}));
}

export const deleteTheaterItem = async (id: number) => {
    return parseFetchResponse(await requestWithJsonData('/api/theater/item/' + id, {}, {'method': 'DELETE'}));
}

export const deleteScheduleItem = async (id: number) => {
    return parseFetchResponse(await requestWithJsonData('/api/theater/schedule/' + id, {}, {'method': 'DELETE'}));
}
