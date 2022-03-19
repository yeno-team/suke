import { isAuthenticated } from "@suke/suke-server/src/middlewares/IsAuthenticated";
import { TheaterItemService } from "@suke/suke-server/src/services/theater";
import { RequestHandler, Request, Response } from "express";
import { Service } from "typedi";
import { BaseController } from "../BaseController";

@Service()
export class TheaterScheduleItemsController extends BaseController {
    public route = "/api/theater/schedules";
    readonly middlewares: RequestHandler[] = [isAuthenticated({admin: true})];
    constructor(
        private theaterItemService: TheaterItemService
    ) {
        super();
    }

    public Get = async (req: Request, res: Response): Promise<void> => {
        const items = await this.theaterItemService.getAllScheduleItems({relations: ["item"]});
        res.send(items);
    }
}