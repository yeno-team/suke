import Container, { Service } from "typedi";
import { BaseController } from "../BaseController";
import { Request , Response } from "express";
import { GlobalEmoteService } from "./globalemote";
import { steggy } from "@suke/suke-util/src/";
import redis from "redis";
import path from "path";
import fs from "fs";
@Service()
export class GlobalEmoteGetController extends BaseController {
    private redisClient : redis.RedisClientType = Container.get("redis")
    private emotePackFilePath = path.join(__dirname , "global.png")
    public route = "/asset/global.png";
    
    constructor(
        private GlobalEmoteService : GlobalEmoteService
    ) {
        super();
    }

    public Get = async (req : Request , res : Response) : Promise<void> => {
        if(await this.redisClient.get("globalEmotesCache") && fs.existsSync(this.emotePackFilePath)) {
            res.sendFile(this.emotePackFilePath)
            return
        }

        const { image , emotePositions } = await this.GlobalEmoteService.getEmotePack({ pages : 4 })
        const cacheData = JSON.stringify(emotePositions)

        await this.redisClient.setEx("globalEmotesCache" , 60 * 60 , cacheData)
        
        // Conceal the data inside the image.
        const imgWithData = steggy.hideMessage(image , cacheData)

        // Write the image to the file path.
        await imgWithData.writeAsync(this.emotePackFilePath)

        res.sendFile(this.emotePackFilePath)
    }
}