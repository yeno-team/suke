import { Inject, Service } from "typedi";
import { BaseController } from "../BaseController";
import { Request , Response } from "express";
import { GlobalEmojiService } from "./service";
import redis from "redis";

@Service()
export class GlobalEmojiGetController extends BaseController {
    public route = "/asset/globalemojis";
    
    @Inject("redis")
    private redis : redis.RedisClientType;

    constructor(
        private GlobalEmojiService : GlobalEmojiService
    ) {
        super();
    }

    public Get = async (req : Request , res : Response) : Promise<void> => {
        const globalEmojisCache = await this.redis.get("GlobalEmojiCache")

        if(!(globalEmojisCache)) {
            const getGlobalEmojis = await this.GlobalEmojiService.getGlobalEmojis(2)
            await this.redis.setEx("GlobalEmojiCache" , 60 * 60 , JSON.stringify(getGlobalEmojis))
            
            res.status(200).json(getGlobalEmojis)
            return
        } 

        res.status(200).send(JSON.parse(globalEmojisCache))
    }
}