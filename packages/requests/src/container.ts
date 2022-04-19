import "reflect-metadata";
import { Container , Token } from "typedi";
import axios from "axios";
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import config from "./config";

const jar = new CookieJar();

const proxy = config.proxy.host && config.proxy.host != "" ? {host: config.proxy.host as string, port: parseInt(config.proxy.port as string), auth: {username: config.proxy.auth.username as string, password: config.proxy.auth.password as string}} : false;
console.log(proxy);
export const AxiosInstanceToken = new Token<string>("AxiosInstance");
Container.set(AxiosInstanceToken, axios.create({ timeout : 15000, proxy }));

export const AxiosCookieJarInstanceToken = new Token<string>("AxiosInstanceCookieJar");
Container.set(AxiosCookieJarInstanceToken, wrapper(axios.create({ timeout : 15000, proxy })));
