import "reflect-metadata";
import { Container} from "typedi";
import { AnimeFoxParser } from "./animefox";
import { DailymotionParser } from "./dailymotion";
import { Fast32Parser } from "./fast32";
import { FzMoviesParser } from "./fzmovies";
// import { GogoAnimeParser } from "./gogoanime";
// import KickAssAnimeParser from "./kickassanime";
import { MobileTvShowsParser } from "./mobiletvshows";
import { VumooParser } from "./vumoo";
import { YoutubeParser } from "./youtube";

export const parsers = [
    // Container.get(VumooParser),
    // Container.get(Fast32Parser),
    // Container.get(AnimeFoxParser),
    Container.get(YoutubeParser),
    // Container.get(FzMoviesParser),
    // Container.get(MobileTvShowsParser),
    Container.get(DailymotionParser)
];