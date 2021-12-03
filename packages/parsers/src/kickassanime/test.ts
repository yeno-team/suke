import { ParserSearchOptions } from "@suke/suke-core/src/entities/Parser";
import Container from "typedi";
import KickAssAnimeParser from ".";

const a = Container.get(KickAssAnimeParser)
a.search("dragon" , new ParserSearchOptions({ pageNumber : 8 , limit : 10})).then(console.log)