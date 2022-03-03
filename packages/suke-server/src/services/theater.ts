import { ITheaterItem, TheaterItem, TheaterItemModel } from "@suke/suke-core/src/entities/TheaterItem";
import { TheaterItemScheduleModel, TheaterItemSchedule } from "@suke/suke-core/src/entities/TheaterItemSchedule";
import { Service } from "typedi";
import { FindManyOptions, Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";


@Service()
export class TheaterItemService {
    constructor(
        @InjectRepository(TheaterItemModel) private theaterItemRepository: Repository<TheaterItemModel>,
        @InjectRepository(TheaterItemScheduleModel) private theaterItemScheduleRepository: Repository<TheaterItemScheduleModel >
    ) {}

    public async findItemById(id: number, options?: FindManyOptions): Promise<TheaterItemModel[]> {
        return (await this.theaterItemRepository.findByIds([id], options));
    }

    public async getAllItems(opts?: FindManyOptions): Promise<ITheaterItem[]> {
        return (await this.theaterItemRepository.find(opts));
    }

    public async deleteItem(id: number) {
        return (await this.theaterItemRepository.delete(id));
    }

    public async createItem(item: TheaterItem) {
        const model = this.theaterItemRepository.create(item);
        return await model.save();
    }

    public async editItem(id: number, editedData: Partial<ITheaterItem>) {
        const foundItems = await this.theaterItemRepository.find({where: {id}});
        
        if (foundItems.length <= 0) {
            throw new Error("Item Id did not match any entries.");
        }

        const foundItem = foundItems[0];
        return await this.theaterItemRepository.save({id: foundItem.id, ...editedData});
    }

    public async findScheduleItemById(id: number, options?: FindManyOptions): Promise<TheaterItemScheduleModel []> {
        return (await this.theaterItemScheduleRepository.findByIds([id], options));
    }

    public async getAllScheduleItems(opts?: FindManyOptions): Promise<TheaterItemScheduleModel []> {
        return (await this.theaterItemScheduleRepository.find(opts));
    }

    public async deleteScheduleItem(id: number) {
        return (await this.theaterItemScheduleRepository.delete(id));
    }

    public async editScheduleItem(id: number, editedData: Partial<ITheaterItem>) {
        const foundItems = await this.theaterItemScheduleRepository.find({where: {id}});
        
        if (foundItems.length <= 0) {
            throw new Error("Item Id did not match any entries.");
        }

        const foundItem = foundItems[0];
        return await this.theaterItemScheduleRepository.save({id: foundItem.id, ...editedData});
    }

    public async createScheduleItem(item: TheaterItemSchedule) {
        const model = await this.theaterItemScheduleRepository.create(item);
        return await model.save();
    }
} 