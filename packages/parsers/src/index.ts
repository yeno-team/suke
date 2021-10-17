import "reflect-metadata";
import { Container } from "typedi";
import { KickAssAnimeParser } from "./kickassanime";

const a = Container.get(KickAssAnimeParser)
a.getVideos("https://www2.kickassanime.ro/anime/kingdom-3rd-season-853741/episode-26-467503").then(console.log).catch(console.error)

export default [
    KickAssAnimeParser
]