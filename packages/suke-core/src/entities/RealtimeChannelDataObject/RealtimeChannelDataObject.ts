import { ValueObject } from "../../ValueObject";
import { RealtimeRoomData } from "../../types/UserChannelRealtime";
import { IVideoSource } from "../SearchResult";
import { ValidationError } from "../../exceptions/ValidationError";

export class RealtimeRoomDataObject extends ValueObject implements RealtimeRoomData {
    id: string;
    title: string;
    category: string;
    viewerCount: number;
    thumbnail: { url: string; };
    currentVideo: { sources: IVideoSource[]; name: string; thumbnail_url: string; };
    paused: boolean;
    progress: { currentTime: number; };
    password: string;
    private: boolean;
    followerOnlyChat: boolean;
    live: boolean;

    constructor(msg: RealtimeRoomData) {
        super();

        this.id = msg.id;
        this.title = msg.title;
        this.category = msg.category;
        this.viewerCount = msg.viewerCount;
        this.thumbnail = msg.thumbnail;
        this.currentVideo = msg.currentVideo;
        this.paused = msg.paused;
        this.progress = msg.progress;
        this.private = msg.private;
        this.password = msg.password;
        this.followerOnlyChat = msg.followerOnlyChat;
        this.live = msg.live;

        if (!this.IsValid()) {
            throw new ValidationError(`msg obj: ${JSON.stringify(msg)} is not valid.`);
        }
    }


    protected *GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        yield this.id;
        yield this.title;
        yield this.category;
        yield this.viewerCount;
        yield this.thumbnail;
        yield this.currentVideo;
        yield this.paused;
        yield this.progress;
        yield this.private;
        yield this.password;
        yield this.followerOnlyChat;
        yield this.live;
        return;
    }
    protected IsValid(): boolean {
        if (typeof(this.id) !== 'string') return false;

        return true;
    }
}