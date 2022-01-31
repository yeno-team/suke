import { YoutubeApiWrapper } from "./youtube";
import { KickAssAnimeApiWrapper } from "./kickassanime";
import Container from "typedi";
import { StreamLordApiWrapper } from "./streamlord/wrapper";

Container.get(StreamLordApiWrapper).getSourceFile(new URL("http://www.streamlord.com/watch-movie-maleficent-26.html")).then(r => console.log(r));

export {
    YoutubeApiWrapper,
    KickAssAnimeApiWrapper
};