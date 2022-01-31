
import { AxiosRequest } from "@suke/requests/src";
import { Service } from "typedi";
import * as cheerio from "cheerio";
/// <reference types="../index.d.ts" />
import safeEval from "safe-eval";

@Service()
export class StreamLordApiWrapper {
    constructor(
        private request: AxiosRequest
    ) {}

    public async getSourceFile(url: URL): Promise<URL> {
        if (url.host !== "www.streamlord.com") throw new Error(`${url.host} is not supported.`);

        const pageSource = await this.request.get<string>(url);
        const $ = cheerio.load(pageSource);

        if ($('.addwatch').length > 0) {
            // is a movie
            return this.getMovieSource(pageSource);
        } else {
            // is a tv show episode
            return this.getTvShowEpisode(pageSource);
        }
    }

    private getMovieSource(source: string): URL {
        const found = /http:\/\/45\.148\.26\.47:8080(.*)"/gm.exec(source);
        if (found == null || found.length <= 0) {
            throw new Error('Could not get movie source.');
        } else {
            return new URL("http://45.148.26.47:8080" + found[1]);
        }
    }

    private getTvShowEpisode(source: string): URL {
        const found = /"file": eval\((.*)\)/gm.exec(source);

        if (found == null || found.length <= 0) {
            throw new Error("Could not grab source.");
        } else {
            const obfuscatedCode = found[1];
            const url = safeEval(obfuscatedCode);

            if (typeof(url) != "string") {
                throw new Error("Unexpected error occured while grabbing the source file.");
            }
            
            return new URL(url.split('"')[1]);
        }
    }
}