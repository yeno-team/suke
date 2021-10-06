import { AxiosInstanceToken } from "../container";
import { Service , Inject } from "typedi";
import { IRequest, RequestOptions } from "../IRequest";
import { AxiosInstance, AxiosProxyConfig, AxiosRequestConfig, Method } from "axios";

@Service()
export class AxiosRequest implements IRequest {
    constructor(
        @Inject(AxiosInstanceToken) public axiosInstance : AxiosInstance 
    ) {}

    private convertToAxiosOpts(options : RequestOptions) : AxiosRequestConfig {
        const axiosClientOpts: AxiosRequestConfig = {
            url: options.url,
            headers : options.headers,
            method: options.method as Method,
            baseURL: options.baseURL,
            params: options.params,
            data: options.body,
            withCredentials: options.CORS,
            maxRedirects: options.maxRedirects,
            httpAgent: options.httpAgent,
            httpsAgent: options.httpsAgent,
            proxy: options.proxy as unknown as AxiosProxyConfig
        }

        return axiosClientOpts;
    }

    async request<R>(options: RequestOptions):  Promise<R> {
        const req = await this.axiosInstance.request(this.convertToAxiosOpts(options))
        return req.data
    }

    async get<R>(url: string, options?: RequestOptions): Promise<R> {
        return await this.request({
            url,
            method : "GET",
            ...options
        })
    }

    async post<R>(url: string, options?: RequestOptions): Promise<R> {
        return await this.request({
            url,
            method : "POST",
            ...options
        })
    }
}