import { CategoryModel } from "@suke/suke-core/src/entities/Category";
import { Service } from "typedi";
import {  Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";


@Service()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryModel) private categoryRepository: Repository<CategoryModel>
    ){}

    public async findById(id: number): Promise<CategoryModel> {
        return (await this.categoryRepository.findByIds([id], { select: ["label", "value", "viewerCount"] }))[0]
    }

    public async getCategories(pageNumber = 1, limit = 40): Promise<CategoryModel[]> {
        return await this.categoryRepository.find({ 
            order: {
                viewerCount: 'DESC'
            },
            take: limit,
            skip: Math.max(pageNumber - 1, 0) * limit
        });
    }
}