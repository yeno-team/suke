import { Service } from "typedi";
import { Request , RequestHandler, Response } from "express";
import { BaseController } from "../BaseController";
import { S3Service } from "../../services/s3";
import { Readable } from "stream";
import multer from "multer";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { createRateLimiter } from "../../middlewares/createRateLimiter";
import UploadFileRateLimiter from "../../limiters/UploadFileRateLimiter";
import { isAuthenticated } from "../../middlewares/IsAuthenticated";
import { createUserAttacher, UserIdentifier } from "../../middlewares/createUserAttacher";

const upload = multer({dest: 'uploads/'});

@Service()
export class ImageUploadController extends BaseController {
    public route = "/api/image/upload"
    
    public middlewares: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>[] = [
        createRateLimiter(UploadFileRateLimiter),
        isAuthenticated(),
        createUserAttacher(UserIdentifier.Session),
        upload.single('avatar')
    ];

    constructor(
        private s3Service: S3Service
    ) {
        super();
    }

    public Post = async (req : Request , res : Response ) : Promise<void> => {
        if (req.file == null) throw new Error("There is no file attached.");
        const filename = res.locals.user!.name + Date.now() + ".png";
        await this.s3Service.putObject(filename, req.file.buffer);
        res.send({
            filename,
            created: true
        });
    }
}