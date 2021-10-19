import "reflect-metadata";
import { Container } from "typedi";
import { KickAssAnimeParser , KickAssAnimeEpisodeUrl } from "./kickassanime";

const a = Container.get(KickAssAnimeParser)
a.getVideos(new KickAssAnimeEpisodeUrl("https://www2.kickassanime.ro/anime/komi-cant-communicate-178143/episode-01-816427")).then(console.log).catch(console.error)

export default [
    KickAssAnimeParser
]