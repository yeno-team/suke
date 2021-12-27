import Container, { Service } from "typedi";
import { BaseController } from "../BaseController";
import { Request , Response } from "express";
import { GlobalEmoteService } from "./globalemote";
import redis from "redis";
import path from "path";
import fs from "fs";
import steggy from "steggy-noencrypt";
@Service()
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
            res.sendFile(this.emotePackFilePath)
            return
        }

        const { image , emotePositions } = await this.GlobalEmoteService.getEmotePack({ pages : 5 })
        const cacheData = JSON.stringify(emotePositions)

        await this.redisClient.setEx("globalEmotesCache" , 60 * 60 , cacheData)
        const buffer = await image.getBufferAsync("image/png")
        
        // Conceal the data inside the image.
        const img = steggy.conceal(buffer , cacheData)
        await fs.writeFileSync(this.emotePackFilePath , img)

        console.log(cacheData)

        res.sendFile(this.emotePackFilePath)
    }
}