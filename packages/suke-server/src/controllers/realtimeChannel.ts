import { Service } from "typedi";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";
import { RealtimeChannelService } from "@suke/suke-server/src/services/realtimeChannel";

@Service()
export class RealtimeChannelsController extends BaseController {
    public route = "/api/realtime/channels";

    constructor(
        private realtimeChannelService: RealtimeChannelService,
    ) {
        super();
    }

    public Get = async (req: Request, res: Response): Promise<void> => {
        const pageNumber = req.params.paegNumber || "1";
        const limit = req.params.limit || "40";
        if (parseInt(limit) > 100) {
            throw new Error("Limit cannot be higher than 100");
        }
        res.send(await this.realtimeChannelService.getSortedChannels(parseInt(pageNumber), parseInt(limit)));
    }
}