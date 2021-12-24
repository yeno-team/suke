import { Service } from "typedi";

import { Request, Response } from 'express';
import { BaseController } from "../BaseController";
import { parsers } from "@suke/parsers/src";

@Service()
export class SourceListController extends BaseController {
    public route = "/api/source/list";

    constructor(
        
    ) {
        super();
    }

    public Get = async (req: Request, res: Response): Promise<void> => {
        res.send(parsers.flatMap(v => v.name));
    }
}