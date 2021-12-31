import Container, { Service } from "typedi";
import { BaseController } from "../BaseController";
import { Request , Response } from "express";
import { GlobalEmojiService } from "./globalemoji";
import { steggy } from "@suke/suke-util/src/";
import redis from "redis";
import path from "path";
import fs from "fs";
@Service()
export class GlobalEmojiGetController extends BaseController {
    private redisClient : redis.RedisClientType = Container.get("redis")
    private emotePackFilePath = path.join(__dirname , "global.png")
    public route = "/asset/global.png";
    
    constructor(
        private GlobalEmojiService : GlobalEmojiService
    ) {
        super();
    }

    public Get = async (req : Request , res : Response) : Promise<void> => {
        if(await this.redisClient.get("globalEmotesCache") && fs.existsSync(this.emotePackFilePath)) {
            res.sendFile(this.emotePackFilePath)
            return
        }

        const { image , data } = await this.GlobalEmojiService.getEmotePack({ pages : 4 })

        await this.redisClient.setEx("globalEmotesCache" , 60 * 60 , data.toString())

        // Conceal the data inside the image.
        const imgWithData = steggy.hideMessage(image , data.toString())

        // Write the image to the file path.
        await imgWithData.writeAsync(this.emotePackFilePath)

        console.log(data.toString())

        res.sendFile(this.emotePackFilePath)
    }
}