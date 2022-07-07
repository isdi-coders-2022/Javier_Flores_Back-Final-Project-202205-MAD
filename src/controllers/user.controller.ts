import { NextFunction, Request, Response } from 'express';
import { HydratedDocument, Model } from 'mongoose';
import { BasicController } from './basic.controller.js';
import { iTokenPayload } from '../interfaces/token.js';
import * as aut from '../services/authorization.js';
import { Suitcase } from '../models/suitcase.model.js';

export class UserController<T> extends BasicController<T> {
    constructor(public model: Model<T>) {
        super(model);
    }

    getAllController = async (req: Request, res: Response) => {
        req;
        res.setHeader('Content-type', 'application/json');
        res.send(await this.model.find().populate('suitcases'));
    };

    getController = async (req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Content-type', 'application/json');
        console.log('Search for id:', req.params.id);
        let result;
        try {
            result = await this.model
                .findById(req.params.id)
                .populate('suitcases');
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
        let newItem: HydratedDocument<any>;
        try {
            req.body.password = await aut.encrypt(req.body.password);
            newItem = await this.model.create(req.body);
            res.setHeader('Content-type', 'application/json');
            res.status(201);
            res.send(JSON.stringify(newItem));
        } catch (error) {
            next(RangeError);
            return;
        }
    };
    // Controller for patch suitcase array and erase suitcase from collection

    loginController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const findUser: any = await this.model.findOne({ name: req.body.name });
        if (
            !findUser ||
            !(await aut.compare(req.body.password, findUser.password))
        ) {
            const error = new Error('Invalid user or password');
            error.name = 'UserAuthorizationError';
            next(error);
            return;
        }
        const tokenPayLoad: iTokenPayload = {
            id: findUser.id,
            name: findUser.name,
        };

        const token = aut.createToken(tokenPayLoad);
        res.setHeader('Content-type', 'application/json');
        res.status(201);
        res.send(JSON.stringify({ token, id: findUser.id }));
    };
    deleteController = async (req: Request, res: Response) => {
        const deletedUser = await this.model.findByIdAndDelete(req.params.id);
        if (deletedUser === null) {
            res.status(404);
            res.send(
                JSON.stringify({
                    error: 'Delete impossible',
                })
            );
        } else {
            // DELETE SUITCASES OF USER FROM SUITCASES COLLECTION
            await Suitcase.deleteMany({ owner: deletedUser.id });

            res.status(202);
            res.send(JSON.stringify(deletedUser));
        }
    };
}
