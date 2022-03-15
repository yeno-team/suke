import { Service } from "typedi";
import { Request, Response } from 'express';
import { BaseController } from "../BaseController";
import { UserChannelService } from "@suke/suke-server/src/services/channel";

interface UserSearchQuery {
    limit?: string,
    sortDirection?: "ASC" | "DESC",
    pageNumber?: string
}

@Service()
export class UserSearchController extends BaseController {
    public route = "/api/search/users/:searchTerm";

    constructor(
        private channelService: UserChannelService
    ) {
        super();
    }

    public Get = async (req: Request, res: Response): Promise<void> => {
        const searchTerm = req.params.searchTerm;
        const body = req.query as UserSearchQuery;
        
        res.status(200).send(await this.channelService.search(searchTerm, body.pageNumber ? parseInt(body.pageNumber) : 1, body.limit ? parseInt(body.limit) : 20, body.sortDirection));
    }
}