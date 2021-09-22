import { Express, Request, Response } from 'express';
import { catchErrorAsync } from '../middlewares/catchErrorAsync';

export abstract class BaseController {
    public abstract route: string;

    constructor() {}

    public execute(app: Express): void {
        app.route(this.route)
            .get(catchErrorAsync(this.Get))
            .post(catchErrorAsync(this.Post))
            .put(catchErrorAsync(this.Put))
            .patch(catchErrorAsync(this.Patch))
            .delete(catchErrorAsync(this.Delete))
    }

    protected async Get(req: Request, res: Response): Promise<void> {
        res.sendStatus(404);
    };

    protected async Post(req: Request, res: Response): Promise<void> {
        res.sendStatus(404);
    };

    protected async Put(req: Request, res: Response): Promise<void> {
        res.sendStatus(404);
    };

    protected async Patch(req: Request, res: Response): Promise<void> {
        res.sendStatus(404);
    };

    protected async Delete(req: Request, res: Response): Promise<void> {
        res.sendStatus(404);
    };
}