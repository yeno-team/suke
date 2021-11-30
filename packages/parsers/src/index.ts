import "reflect-metadata";
import { Container} from "typedi";
import KickAssAnimeParser from "./kickassanime";
import { YoutubeParser } from "./youtube";

export const parsers = [
    Container.get(YoutubeParser),
    Container.get(KickAssAnimeParser)
]