import { TheaterItemService } from "@suke/suke-server/src/services/theater";
import { Service } from "typedi";
import { BaseController } from "../BaseController";


@Service()
export class TheaterItemsController extends BaseController {
    public route = "/api/theater/items";

    constructor(
        private theaterItemService: TheaterItemService
    ) {
        super();
    }

    public Get = async (req, res): Promise<void> => {
        const items = await this.theaterItemService.getAll({relations: ["schedules"]});
        res.send(items);
    }
    
}