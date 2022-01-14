import { Service } from "typedi";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";
import { CategoryService } from "../services/category";

@Service()
export class CategoryController extends BaseController {
    public route = "/api/categories";

    constructor(
        private categoryService: CategoryService,
    ) {
        super();
    }

    public Get = async (req: Request, res: Response): Promise<void> => {
        const pageNumber = req.params.pageNumber || "1";
        const limit = req.params.limit || "40";
        if (parseInt(limit) > 100) {
            throw new Error("Limit cannot be higher than 100");
        }
        res.send(await this.categoryService.getCategories(parseInt(pageNumber), parseInt(limit)));
    }
}