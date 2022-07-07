import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { BasicController } from './basic.controller.js';
import { User } from '../models/user.model.js';
import { iSuitcase } from '../models/suitcase.model.js';

export class SuitcaseController<T> extends BasicController<T> {
    constructor(public model: Model<T>) {
        super(model);
    }

    getAllController = async (req: Request, res: Response) => {
        req;
        res.setHeader('Content-type', 'application/json');
        res.send(
            await this.model
                .find()
                .populate({ path: 'items', populate: 'item' })
        );
    };

    getController = async (req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Content-type', 'application/json');
        console.log('Search for id:', req.params.id);
        let result;
        try {
            result = await this.model
                .findById(req.params.id)
                .populate({ path: 'items', populate: 'item' });
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

    postController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            let user;
            user = await User.findById(req.body.owner);
            if (!user) {
                const error = new Error('User not found');
                error.name = 'UserError';
                throw error;
            }

            const newSuitcase = await this.model.create(req.body);

            user.suitcases = [
                ...(user.suitcases as unknown as Array<iSuitcase>),
                newSuitcase.id,
            ];
            user.save();

            res.setHeader('Content-type', 'application/json');
            res.status(201);
            res.send(JSON.stringify(newSuitcase));
        } catch (error) {
            next(error); // ValidationError
        }
    };
    deleteController = async (req: Request, res: Response) => {
        const deletedSuitcase: iSuitcase | null =
            await this.model.findByIdAndDelete(req.params.id);

        if (deletedSuitcase === null) {
            res.status(404);
            res.send(
                JSON.stringify({
                    error: 'Delete impossible',
                })
            );
        } else {
            // UPDATE USER SUITCASES ARRAY
            await User.updateOne(
                {
                    _id: { $in: deletedSuitcase.owner },
                },
                {
                    $pull: {
                        suitcases: deletedSuitcase.id,
                    } as { [key: string]: string },
                }
            );
            res.status(202);
            res.send(JSON.stringify(deletedSuitcase));
        }
    };
}
