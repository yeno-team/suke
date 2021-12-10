import { IMultiData, IMultiStandaloneData, IStandaloneData, StandaloneType } from "@suke/suke-core/src/entities/SearchResult";
import { IHasUserId } from "../UserId/UserId";

export type Request = {
    requestType: 'multi'
    requestedData: IMultiStandaloneData,
    requestedMulti: IMultiData,
    requestedBy: (IHasUserId & {name: string})[],
    roomId: string
} | {
    requestType: 'standalone',
    requestedData: IStandaloneData,
    requestedBy: (IHasUserId & {name: string})[],
    roomId: string
}

export const getRequestedId = (v: Request): string => (v.requestType === "multi" ? v.requestedMulti.id : v.requestedData.id);
export const isRequestsEqual = (req1: Request, req2: Request): boolean => {
    if (req1 == null || req2 == null) return false;
    
    if (req1.requestType === 'standalone' && req2.requestType === 'standalone') {
        if (getRequestedId(req1) === getRequestedId(req2)) return true;
    } else if (req1.requestType === 'multi' && req2.requestType === 'multi' && req1.requestedMulti.id === req2.requestedMulti.id) {
        if (req1.requestedData.index === req2.requestedData.index) {
            return true;
        }
    }
    return false;
}