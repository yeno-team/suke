import { isAuthenticated } from "@suke/suke-server/src/middlewares/IsAuthenticated";
import { TheaterItemService } from "@suke/suke-server/src/services/theater";
import { Service } from "typedi";
import { BaseController } from "../BaseController";
import { TheaterItem } from "@suke/suke-core/src/entities/TheaterItem";
import { PropertyValidationError } from "@suke/suke-core/src/exceptions/ValidationError";
 
@Service()
export class TheaterItemController extends BaseController {
    public route = "/api/theater/item/:id?";
    readonly middlewares = [isAuthenticated({admin: true})];
    constructor(
        private theaterItemService: TheaterItemService
    ) {
        super();
    }

    public Post = async (req, res): Promise<void> => {
        const data = new TheaterItem({ id: 0, viewerCount: 0, followers: [], schedules: [], ...req.body });
        await this.theaterItemService.createItem(data);
        res.send({message:"Created."});
    }

    public Get = async (req, res): Promise<void> => {
        const id = req.params.id;
        if (typeof(id) != 'string') throw new PropertyValidationError('id');
        const item = await this.theaterItemService.findItemById(parseInt(id), {relations: ["schedules"]});
        res.send(item);
    }

    public Patch = async (req, res): Promise<void> => {
        const id = req.params.id;
        if (typeof(id) != 'string') throw new PropertyValidationError('id');
        await this.theaterItemService.editItem(parseInt(id), req.body);
        res.send({message: "Edited"});
    }

    public Delete = async (req, res): Promise<void> => {
        const id = req.params.id;
        if (typeof(id) != 'string') throw new PropertyValidationError('id');
        await this.theaterItemService.deleteItem(parseInt(id));
        res.send({message: "Deleted"});
    }
}