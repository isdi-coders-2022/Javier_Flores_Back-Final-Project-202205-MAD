/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
export class BasicController<T> {
    constructor(public model: Model<T>) {}

    getAllController = async (req: Request, res: Response) => {
        req;
        res.setHeader('Content-type', 'application/json');
        res.send(await this.model.find());
    };

    getController = async (req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Content-type', 'application/json');
        console.log(req.params.id);
        const result = await this.model.findById(req.params.id);
        if (result) {
            res.send(JSON.stringify(result));
        } else {
            res.status(404);
            res.send(JSON.stringify({}));
        }
    };

    postController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const newItem = await this.model.create(req.body);
            res.setHeader('Content-type', 'application/json');
            res.status(201);
            res.send(JSON.stringify(newItem));
        } catch (error) {
            next(error);
        }
    };

    patchController = async (req: Request, res: Response) => {
        const newItem = await this.model.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.setHeader('Content-type', 'application/json');
        res.send(JSON.stringify(newItem));
    };

    deleteController = async (req: Request, res: Response) => {
        const deleteItem = await this.model.findByIdAndDelete(req.params.id);
        if (deleteItem === null) {
            res.status(404);
            res.send(
                JSON.stringify({
                    error: 'Delete impossible',
                })
            );
        } else {
            res.status(202);
            res.send(JSON.stringify(deleteItem));
        }
    };
}
