import Container from "typedi";
import { KickAssAnimeApiWrapper } from "./wrapper";

const among = Container.get(KickAssAnimeApiWrapper)

among.getVideoPlayerUrl(new URL("https://www2.kickassanime.ro/anime/rakudai-kishi-no-cavalry-383660/episode-12-110077")).then(console.log)