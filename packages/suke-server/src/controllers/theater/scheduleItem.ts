import { isAuthenticated } from "@suke/suke-server/src/middlewares/IsAuthenticated";
import { TheaterItemService } from "@suke/suke-server/src/services/theater";
import { Service } from "typedi";
import { BaseController } from "../BaseController";
import { PropertyValidationError } from "@suke/suke-core/src/exceptions/ValidationError";
import { ScheduleState, TheaterItemSchedule } from "@suke/suke-core/src/entities/TheaterItemSchedule";
import { RequestHandler, Request, Response } from "express";
 
@Service()
export class TheaterScheduleItemController extends BaseController {
    public route = "/api/theater/schedule/:id?";
    readonly middlewares: RequestHandler[] = [isAuthenticated({admin: true})];
    constructor(
        private theaterItemService: TheaterItemService
    ) {
        super();
    }

    public Post = async (req: Request, res: Response): Promise<void> => {
        const { time, itemId, items } = req.body;
        const item = await this.theaterItemService.findItemById(parseInt(itemId));
        if (item.length <= 0) {
            throw new Error("Invalid Item Id.");
        } 
        if (items != null) {
            for (const v of items) {
                await this.theaterItemService.createScheduleItem(new TheaterItemSchedule({id: 0, item: item[0], state: ScheduleState.Waiting, time: new Date(parseInt(v.time))}));
            }
        } else {
            await this.theaterItemService.createScheduleItem(new TheaterItemSchedule({id: 0, item: item[0], state: ScheduleState.Waiting, time: new Date(parseInt(time))}));
        }

        
        res.send({message:"Created."});
    }

    public Get = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        if (typeof(id) != 'string') throw new PropertyValidationError('id');
        res.send(await this.theaterItemService.findScheduleItemById(parseInt(id), {relations: ["item"]}));
    }

    public Patch = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        if (typeof(id) != 'string') throw new PropertyValidationError('id');
        await this.theaterItemService.editScheduleItem(parseInt(id), req.body);
        res.send({message: "Edited"});
    }

    public Delete = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        if (typeof(id) != 'string') throw new PropertyValidationError('id');
        await this.theaterItemService.deleteScheduleItem(parseInt(id));
        res.send({message: "Deleted"});
    }
}