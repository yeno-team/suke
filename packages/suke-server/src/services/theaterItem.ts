import { TheaterItemModel } from "@suke/suke-core/src/entities/TheaterItem";
import { Service } from "typedi";
import { FindManyOptions, Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";


@Service()
export class TheaterItemService {
    constructor(
        @InjectRepository(TheaterItemModel) private theaterItemRepository: Repository<TheaterItemModel>
    ) {}

    public async findById(id: number, options?: FindManyOptions): Promise<TheaterItemModel[]> {
        return (await this.theaterItemRepository.findByIds([id], options));
    }

} 