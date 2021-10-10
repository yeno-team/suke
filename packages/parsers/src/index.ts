import "reflect-metadata";
import { Container } from "typedi";
import { KickAssAnimeParser } from "./kickassanime";

const a = Container.get(KickAssAnimeParser)
a.getVideos("https://www2.kickassanime.ro/anime/megaton-kyuu-musashi-206389/episode-01-798828").then(console.log)

export default [
    KickAssAnimeParser
]