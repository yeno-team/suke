import "reflect-metadata";
import { Container } from "typedi";
import { KickAssAnimeParser } from "./kickassanime";

// const a = Container.get(KickAssAnimeParser)
// a.search("Movie").then(console.log)

export default [
    KickAssAnimeParser
]