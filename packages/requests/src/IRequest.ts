import { Agent } from "http";
export type RequestOptions = {
    url?: URL,
    method?: string,
    baseURL?: string,
    headers?: Record<string , string>,
    params?: { name: string, value: unknown } | URLSearchParams,
    body?: unknown,
    CORS?: boolean,
    maxRedirects?: number,
    httpAgent?: Agent,
    httpsAgent?: Agent,
    responseType?: string,
    disableCookies?: boolean,
    proxy?: { host: string, port: number, auth: Record<string , unknown> }
}

export interface IRequest {
    request<R>(options: RequestOptions): Promise<R>;
    get<R>(url: URL ,options?: RequestOptions): Promise<R>;
    post<R>(url: URL ,options?: RequestOptions): Promise<R>;
}