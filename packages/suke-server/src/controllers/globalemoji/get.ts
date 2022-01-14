import { Service } from "typedi";
import { BaseController } from "../BaseController";
import { Request , Response } from "express";
import { GlobalEmojiGetService } from "./GetGlobalEmojiService";
import { GlobalEmojiCacheService } from "@suke/suke-server/src/services/globalemoji";
import { createSHA256Hash } from "@suke/suke-util/src/createSha256Hash";

@Service()
export class GlobalEmojiGetController extends BaseController {
    public route = "/asset/globalemojis";

    constructor(
        private GlobalEmojiCacheService : GlobalEmojiCacheService,
        private GlobalEmojiGetService : GlobalEmojiGetService
    ) {
        super();
    }

    public Get = async (req : Request , res : Response) : Promise<void> => {
        const globalEmojiCache = await this.GlobalEmojiCacheService.getGlobalEmojiCache()
        
        res.setHeader("Cache-Control","no-cache")

        if(globalEmojiCache) {
            res.setHeader("ETag", createSHA256Hash(JSON.stringify(globalEmojiCache)))
            res.status(200).json(globalEmojiCache)
            return
        }

        const emojis = await this.GlobalEmojiGetService.getGlobalEmojis(2)
        await this.GlobalEmojiCacheService.setGlobalEmojiCache(emojis)
        
        res.setHeader("ETag", createSHA256Hash(JSON.stringify(emojis)))
        res.status(200).json(emojis)
    }
}