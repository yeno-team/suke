import { Service } from "typedi";
import { Request , Response } from "express";
import { BaseController } from "../BaseController";
import { S3Service } from "../../services/s3";
import { Readable } from "stream";

@Service()
export class ImageGetController extends BaseController {
    public route = "/api/images/:key"
    
    constructor(
        private s3Service: S3Service
    ) {
        super();
    }

    public Get = async (req : Request , res : Response ) : Promise<void> => {
        const obj = await this.s3Service.getObject(req.params.key);
        res.setHeader('content-length', obj.ContentLength!);
        res.setHeader('content-type', obj.ContentType!);
        (obj.Body! as Readable).pipe(res);
    }

    
}