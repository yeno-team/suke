import { CategoryModel } from "@suke/suke-core/src/entities/Category";
import { SocketServer } from "../server";
import { getRepository, Repository } from "typeorm";


/**
 * Handles caching category data such as viewer counts
 */
export class CategoryManager {
    /**
     * A Map where the key is the category's "value" or name. 
     * The value is another map where the key is a channel id and its viewer count.
     */
    private categoryCache: Map<string, Map<string, number>>;
    private categoryRepository: Repository<CategoryModel>;

    constructor(private server: SocketServer) {
        this.categoryCache = new Map();
        this.categoryRepository = getRepository(CategoryModel);
        this.startUpdateTimer();
    }

    private startUpdateTimer() {
        setInterval(() => {
            /**
             * Update categories viewer count in db every 10 seconds
             */
            this.categoryCache.forEach(async (map, categoryVal) => {
                const category = await this.categoryRepository.findOne({ where: { value: categoryVal } });
    
                if (category) {
                    let totalViewerCount = 0;
                    
                    map.forEach((v) => totalViewerCount += v);
                    category.viewerCount = Math.max(totalViewerCount, 0);
    
                    category.save();
                }
            });
            this.categoryCache = new Map();
        }, 10000);
    }

    public updateRoomViewerCount(roomId: string, category: string, viewerCount: number): void {
        const newCategoryMap = this.categoryCache.get(category) || new Map();
        newCategoryMap.set(roomId, viewerCount);
        this.categoryCache.set(category, newCategoryMap);
    }
}

