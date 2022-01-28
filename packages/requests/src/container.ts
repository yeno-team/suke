import "reflect-metadata";
import { Container , Token } from "typedi";
import axios from "axios";

export const AxiosInstanceToken = new Token<string>("AxiosInstance");
Container.set(AxiosInstanceToken , axios.create({ timeout : 5000 }));
