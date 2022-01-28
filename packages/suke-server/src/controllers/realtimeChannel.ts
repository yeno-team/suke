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
        const pageNumber = parseInt(req.query.pageNumber as string || "1");
        const limit = parseInt(req.query.limit as string || "40");
        if (limit > 100) {
            throw new Error("Limit cannot be higher than 100");
        }

        let direction = req.query.sortDirection;
        if (direction == null) {
            direction = "DESC";
        } else if (typeof(direction) != 'string') { 
            throw new Error("'sortDirection' should be of type string");
        } else if (direction !== 'ASC' && direction !== 'DESC') {
            throw new Error("'sortDirection' should either be 'ASC' or 'DESC'");
        }

        res.send(await this.realtimeChannelService.getSortedChannels(pageNumber, limit, direction as "ASC" | "DESC"));
    }
}