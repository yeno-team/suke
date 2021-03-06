import "reflect-metadata";
import { Container , Token } from "typedi";
import axios from "axios";
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const jar = new CookieJar();
export const AxiosInstanceToken = new Token<string>("AxiosInstance");
Container.set(AxiosInstanceToken, axios.create({ timeout : 15000 }));

export const AxiosCookieJarInstanceToken = new Token<string>("AxiosInstanceCookieJar");
Container.set(AxiosCookieJarInstanceToken, wrapper(axios.create({ timeout : 15000, jar})));
