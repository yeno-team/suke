import { Service } from "typedi";
import { BaseController } from "../BaseController";
import { Request, Response } from "express";
import { CategoryService } from "@suke/suke-server/src/services/category";

@Service()
export class CategoryChannelsController extends BaseController {
    public route = "/api/categories/:categoryVal/channels";

    constructor(
        private categoryService: CategoryService,
    ) {
        super();
    }

    public Get = async (req: Request, res: Response): Promise<void> => {
        const categoryVal = req.params.categoryVal;
        const pageNumber = parseInt(req.query.pageNumber as string || "1");
        const limit = parseInt(req.query.limit as string || "20");
        
        let direction = req.query.sortDirection;
        if (direction == null) {
            direction = "DESC";
        } else if (typeof(direction) != 'string') { 
            throw new Error("'sortDirection' should be of type string");
        } else if (direction !== 'ASC' && direction !== 'DESC') {
            throw new Error("'sortDirection' should either be 'ASC' or 'DESC'");
        }

        if (limit > 100) {
            throw new Error("Limit cannot be higher than 100");
        }
        res.send(await this.categoryService.getCategoryChannels(categoryVal, pageNumber as number, limit, direction as "ASC" | "DESC"));
    }
}