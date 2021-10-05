import { Agent } from "http";

export type RequestOptions = {
    url?: string,
    method?: string,
    baseURL?: string,
    headers?: Record<string , string>,
    params?: { name: string, value: unknown },
    body?: { name: string, value: unknown },
    CORS?: boolean,
    maxRedirects?: number,
    httpAgent?: Agent,
    httpsAgent?: Agent,
    proxy?: { host: string, port: number, auth: Record<string , unknown>}
}

export interface IRequest {
    request<R>(options: RequestOptions): Promise<R>;
    get<R>(url: string,options?: RequestOptions): Promise<R>;
    post<R>(url: string,options?: RequestOptions): Promise<R>;
}