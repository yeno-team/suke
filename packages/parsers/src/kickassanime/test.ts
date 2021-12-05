import { ParserSearchOptions } from "@suke/suke-core/src/entities/Parser";
import Container from "typedi";
import KickAssAnimeParser from ".";

const a = Container.get(KickAssAnimeParser)
a.search("Komi Can't Communicate", new ParserSearchOptions({ pageNumber : 1 })).then(console.log).catch(console.error)