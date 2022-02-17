import { RealtimeRoomData } from "@suke/suke-core/src/types/UserChannelRealtime";
import { parseFetchResponse } from "../parseFetchResponse"

export const getRealtimeChannels = async (pageNumber = 1, limit = 20): Promise<RealtimeRoomData[]> => {
    return await parseFetchResponse(await fetch(`/api/realtime/channels?pageNumber=${pageNumber}&limit=${limit}`));
}
