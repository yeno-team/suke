import { Service } from "typedi";
import { Request, Response } from 'express';
import { BaseController } from "../BaseController";
import { parsers } from "@suke/parsers/src";

interface SourceGetBody {
    url: string,
    engine: string
}

@Service()
export class SourceGetController extends BaseController {
    public route = "/api/source/get";

    constructor(
        
    ) {
        super();
    }

    public Post = async (req: Request, res: Response): Promise<void> => {
        const body = req.body as SourceGetBody;

        const parser = parsers.find(v => v.name?.toLowerCase() === body.engine?.toLowerCase());

        if (parser == null) {
            res.status(400).send({error: 'true', message: 'Unknown Engine.'});
            return;
        }
        
        const response = await parser.getSource(new URL(body.url))

        res.status(200).send(response);
    }
}