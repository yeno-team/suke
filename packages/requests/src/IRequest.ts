import { Agent } from "http";
import { Url } from "@suke/suke-core/src/entities/Url";

export type RequestOptions = {
    url?: Url,
    method?: string,
    baseURL?: string,
    headers?: Record<string , string>,
    params?: { name: string, value: unknown },
    body?: unknown,
    CORS?: boolean,
    maxRedirects?: number,
    httpAgent?: Agent,
    httpsAgent?: Agent,
    proxy?: { host: string, port: number, auth: Record<string , unknown> }
}

export interface IRequest {
    request<R>(options: RequestOptions): Promise<R>;
    get<R>(url: Url ,options?: RequestOptions): Promise<R>;
    post<R>(url: Url ,options?: RequestOptions): Promise<R>;
}