import Container, { Service } from "typedi";
import { BaseController } from "../BaseController";
import { Request , Response } from "express";
import { BetterTTVApiWrapper } from "@suke/wrappers/src/betterttv";
import { BetterTTVEmote , BetterTTVEmoteOpts } from "@suke/wrappers/src/betterttv/types";
import { GlobalEmojiService } from "./service";

@Service()
export class GlobalEmojiGetController extends BaseController {
    public route = "/asset/globalemojis";
    
    constructor(
        private GlobalEmojiService : GlobalEmojiService
    ) {
        super();
    }

    public Get = async (req : Request , res : Response) : Promise<void> => {
        res.send(await this.GlobalEmojiService.getGlobalEmojis(2))
    }
}