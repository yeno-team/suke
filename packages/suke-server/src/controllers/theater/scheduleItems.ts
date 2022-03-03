import { isAuthenticated } from "@suke/suke-server/src/middlewares/IsAuthenticated";
import { TheaterItemService } from "@suke/suke-server/src/services/theater";
import { Service } from "typedi";
import { BaseController } from "../BaseController";

@Service()
export class TheaterScheduleItemsController extends BaseController {
    public route = "/api/theater/schedules";
    readonly middlewares = [isAuthenticated({admin: true})];
    constructor(
        private theaterItemService: TheaterItemService
    ) {
        super();
    }

    public Get = async (req, res): Promise<void> => {
        const items = await this.theaterItemService.getAllScheduleItems({relations: ["item"]});
        res.send(items);
    }
}