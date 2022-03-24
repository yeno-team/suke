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
import { UserService } from "../../services/user";

const upload = multer({dest: 'uploads/', limits: {fileSize: 0.75 * 1000000}});

@Service()
export class ImageUploadController extends BaseController {
    public route = "/api/image/profile/upload"
    
    public middlewares: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>[] = [
        createRateLimiter(UploadFileRateLimiter),
        isAuthenticated(),
        createUserAttacher(UserIdentifier.Session),
        upload.single('avatar')
    ];

    constructor(
        private s3Service: S3Service,
        private userService: UserService
    ) {
        super();
    }

    public Post = async (req : Request , res : Response ) : Promise<void> => {
        if (req.file == null) throw new Error("There is no file attached.");
        if (!['image/png', 'image/jpg', 'image/jpeg', 'image/gif'].some(v => req.file?.mimetype == v)) {
            throw new Error("File is not a image.");
        }
        const filename = res.locals.user!.name + Date.now() + "." + req.file.mimetype.split('/').pop();
        await this.s3Service.putObject(filename, req.file);
        res.locals.user!.pictureFilename = filename;
        res.locals.user!.save();

        res.send({
            filename,
            success: true
        });
    }
}