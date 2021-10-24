import "reflect-metadata";
import { Container } from "typedi";
import { KickAssAnimeParser , KickAssAnimeEpisodeUrl } from "./kickassanime";

const a = Container.get(KickAssAnimeParser)

console.time("khai")
a.getVideos(new KickAssAnimeEpisodeUrl("https://www2.kickassanime.ro/anime/waccha-primagi-489664/episode-03-506341")).then((res) => {
    console.timeEnd("khai")
    console.log(res)
})

export default [
    KickAssAnimeParser
]