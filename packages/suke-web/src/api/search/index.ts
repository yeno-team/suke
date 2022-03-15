import { IUser } from "@suke/suke-core/src/entities/User";
import { RealtimeRoomData } from "packages/suke-core/src/types/UserChannelRealtime";
import { parseFetchResponse } from "../parseFetchResponse";

export const searchUsers = async (searchTerm: string, opts?: {limit?: number, sortDirection?: "ASC" | "DESC", pageNumber?: number}): Promise<IUser[]> => {
    return parseFetchResponse(await fetch(`/api/search/users/${searchTerm}?pageNumber=${opts?.pageNumber}`));
}

export const searchChannels = async (searchTerm: string, opts?: {limit?: number, sortDirection?: "ASC" | "DESC", pageNumber?: number}): Promise<RealtimeRoomData[]> => {
    return parseFetchResponse(await fetch(`/api/search/channels/${searchTerm}?pageNumber=${opts?.pageNumber}`));
}

