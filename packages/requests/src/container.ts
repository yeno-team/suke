import "reflect-metadata";
import { Container , Token } from "typedi";
import axios from "axios";
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const jar = new CookieJar();
export const AxiosInstanceToken = new Token<string>("AxiosInstance");
Container.set(AxiosInstanceToken , wrapper(axios.create({ timeout : 5000, withCredentials: true, jar })));
