import "reflect-metadata";
import { Container } from "typedi";
import { KickAssAnimeParser , KickAssAnimeEpisodeUrl } from "./kickassanime";

const a = Container.get(KickAssAnimeParser)
a.getVideos(new KickAssAnimeEpisodeUrl("https://www2.kickassanime.ro/anime/muteking-the-dancing-hero-495283/episode-04-357348")).then(console.log)

export default [
    KickAssAnimeParser
]