import { Service } from "typedi";
import { BaseController } from "../BaseController";
import { Request, Response } from 'express';
import { ParserSearchOptions, IParserSearchOptions } from '@suke/suke-core/src/entities/Parser';
import { parsers } from '@suke/parsers/src';
import { ValueObject } from "@suke/suke-core/src/ValueObject";
import { PropertyValidationError } from "@suke/suke-core/src/exceptions/ValidationError";


export interface ISourceSearchRequestBody {
    // parser name
    engine: string,
    query: string,
    options?: IParserSearchOptions
}

export class SourceSearchRequestBody extends ValueObject implements ISourceSearchRequestBody {
    engine: string;
    query: string;
    options?: IParserSearchOptions;

    constructor(object: ISourceSearchRequestBody) {
        super();
        this.engine = object.engine;
        this.query = object.query;
        this.options = object.options;

        if (!this.IsValid()) {
            throw new Error("Invalid Search Request body");
        }

    }

    protected *GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        yield this.engine;
        yield this.query;
        yield this.options;
        return;
    }

    protected IsValid(): boolean {
        if (typeof(this.engine) != 'string') {
            throw new PropertyValidationError('engine');
        }

        if (typeof(this.query) != 'string') {
            throw new PropertyValidationError('engine');
        }

        return true;
    }
}

@Service()
export class SourceSearchController extends BaseController {
    public route = "/api/source/search";

    constructor() {
        super();
    }

    public Post = async (req: Request, res: Response): Promise<void> => {
        const body = new SourceSearchRequestBody(req.body);

        const parser = parsers.find(v => v.name.toLowerCase() === body.engine.toLowerCase());

        if (parser == null) {
            throw new PropertyValidationError('engine');
        }
        
        const response = await parser.search(body.query, new ParserSearchOptions(body.options ?? {}));

        res.send(response);
    }
}