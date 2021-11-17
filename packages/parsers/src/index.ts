import "reflect-metadata";
import { Container } from "typedi";
import KickAssAnime from "./kickassanime";

const KickAssAnimeParser = Container.get(KickAssAnime)

export default [
    KickAssAnimeParser
]