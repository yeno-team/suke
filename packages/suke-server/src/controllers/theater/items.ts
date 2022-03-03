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
        const featured = req.query.featured;

        let items;

        if (typeof(featured) == 'string') {
            items = await this.theaterItemService.getAllItems({where: {featured: Boolean(featured)}, relations: ["schedules"]});
        } else {
            items = await this.theaterItemService.getAllItems({relations: ["schedules"]});
        }

        res.send(items);
    }
}