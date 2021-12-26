import Container, { Service } from "typedi";
import { BaseController } from "../BaseController";
import { Request , Response } from "express";
import { GlobalEmoteService } from "./globalemote";
import redis from "redis";
import path from "path";
import fs from "fs";
import steggy from "steggy-noencrypt";
@Service()
// hello world
export class GlobalEmoteGetController extends BaseController {
    private redisClient : redis.RedisClientType = Container.get("redis")
    private emotePackFilePath = path.join(__dirname , "emotepack.png")
    public route = "/asset/emotepack.png";
    
    constructor(
        private GlobalEmoteService : GlobalEmoteService
    ) {
        super();
    }

    public Get = async (req : Request , res : Response) : Promise<void> => {
        if(await this.redisClient.get("globalEmotesCache")) {
            return res.sendFile(this.emotePackFilePath)
        }

        await this.redisClient.setEx("globalEmotesCache" , 60 * 60 , "1")

        const { image , positions , emotes } = await this.GlobalEmoteService.getEmotePack({ pages : 5 })
        const buffer = await image.getBufferAsync("image/png")
        
        // Conceal the data inside the image.
        const img = steggy.conceal(buffer , JSON.stringify({ emotes , positions }))
        await fs.writeFileSync(this.emotePackFilePath , img)

        res.sendFile(this.emotePackFilePath)
    }
}