import { IMultiData, IMultiStandaloneData, IStandaloneData } from "@suke/suke-core/src/entities/SearchResult";

export type Request = {
    requestType: 'multi'
    requestedData: IMultiStandaloneData,
    requestedMulti: IMultiData,
    engine: string,
    requestedBy: {name: string, userId: number}[],
    roomId: string
} | {
    requestType: 'standalone',
    requestedData: IStandaloneData,
    requestedBy: {name: string, userId: number}[],
    engine: string,
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