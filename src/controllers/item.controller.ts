import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { BasicController } from './basic.controller.js';

export class ItemController<T> extends BasicController<T> {
    constructor(public model: Model<T>) {
        super(model);
    }

    getAllController = async (req: Request, res: Response) => {
        req;
        res.setHeader('Content-type', 'application/json');
        res.send(await this.model.find());
    };

    getController = async (req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Content-type', 'application/json');
        console.log('Search for id:', req.params.id);
        let result;
        try {
            result = await this.model.findById(req.params.id);
        } catch (error) {
            next(error);
            return;
        }
        if (result) {
            res.send(JSON.stringify(result));
        } else {
            res.status(404);
            res.send(JSON.stringify({}));
        }
    };
}
