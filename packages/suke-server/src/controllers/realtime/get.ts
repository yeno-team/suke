import { Service } from "typedi";
import { BaseController } from "../BaseController";
import { Request, Response } from "express";
import { RealtimeChannelService } from "@suke/suke-server/src/services/realtimeChannel";

@Service()
export class RealtimeChannelGetController extends BaseController {
    public route = "/api/realtime/channel/:id";

    constructor(
        private realtimeChannelService: RealtimeChannelService,
    ) {
        super();
    }

    public Get = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        const found = await this.realtimeChannelService.getChannel(id);
        if (found == null) {
            res.sendStatus(404);
            return;
        }
        res.json(found);
    }
}