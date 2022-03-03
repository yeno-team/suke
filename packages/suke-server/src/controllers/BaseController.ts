import { Express, Request, RequestHandler, Response } from 'express';
import { catchErrorAsync } from '../middlewares/catchErrorAsync';

export abstract class BaseController {
    public abstract route: string;
    // Global Middlewares defined for this controller, 
    // automatically adds all middlewares in this array to all methods.
    readonly middlewares?: RequestHandler[] = [];

    public execute(app: Express): void {
        app.route(this.route)
            .get(...this.middlewares, catchErrorAsync(this.Get))
            .post(...this.middlewares, catchErrorAsync(this.Post))
            .put(...this.middlewares, catchErrorAsync(this.Put))
            .patch(...this.middlewares, catchErrorAsync(this.Patch))
            .delete(...this.middlewares, catchErrorAsync(this.Delete));
    }

    protected async Get(req: Request, res: Response): Promise<void> {
        res.sendStatus(404);
    }

    protected async Post(req: Request, res: Response): Promise<void> {
        res.sendStatus(404);
    }

    protected async Put(req: Request, res: Response): Promise<void> {
        res.sendStatus(404);
    }

    protected async Patch(req: Request, res: Response): Promise<void> {
        res.sendStatus(404);
    }

    protected async Delete(req: Request, res: Response): Promise<void> {
        res.sendStatus(404);
    }
}