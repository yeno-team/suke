import { ParserSearchOptions } from "@suke/suke-core/src/entities/Parser";
import Container from "typedi";
import KickAssAnimeParser from ".";

const a = Container.get(KickAssAnimeParser)
a.search("Boruto", new ParserSearchOptions({ pageNumber : 1 })).then(console.log).catch(console.error)