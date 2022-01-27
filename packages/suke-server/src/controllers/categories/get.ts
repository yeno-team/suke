import { Service } from "typedi";
import { BaseController } from "../BaseController";
import { Request, Response } from "express";
import { CategoryService } from "../../services/category";

@Service()
export class CategoryGetController extends BaseController {
    public route = "/api/categories";

    constructor(
        private categoryService: CategoryService,
    ) {
        super();
    }

    public Get = async (req: Request, res: Response): Promise<void> => {
        const pageNumber = parseInt(req.query.pageNumber as string || "1");
        const limit = parseInt(req.query.limit as string || "20");
        if (limit > 100) {
            throw new Error("Limit cannot be higher than 100");
        }
        res.send(await this.categoryService.getCategories(pageNumber, limit));
    }
}