import "reflect-metadata";
import { Container} from "typedi";
import { FzMoviesParser } from "./fzmovies";
import { GogoAnimeParser } from "./gogoanime";
import KickAssAnimeParser from "./kickassanime";
import { MobileTvShowsParser } from "./mobiletvshows";
import { YoutubeParser } from "./youtube";

export const parsers = [
    Container.get(YoutubeParser),
    Container.get(GogoAnimeParser),
    Container.get(KickAssAnimeParser),
    Container.get(FzMoviesParser),
    Container.get(MobileTvShowsParser)
];