import { NextFunction, Request, Response } from 'express';
import { HydratedDocument, Model } from 'mongoose';
import { BasicController } from './basic.controller.js';
// import { iTokenPayload } from '../interfaces/token.js';
import * as aut from '../services/authorization.js';

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

    postController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        let newItem: HydratedDocument<any>;
        try {
            req.body.password = await aut.encrypt(req.body.password);
            newItem = await this.model.create(req.body);
        } catch (error) {
            next(error);
            return;
        }
        res.setHeader('Content-type', 'application/json');
        res.status(201);
        res.send(JSON.stringify(newItem));
    };

    //     loginController = async (
    //         req: Request,
    //         res: Response,
    //         next: NextFunction
    //     ) => {
    //         const findUser: any = await this.model.findOne({ name: req.body.name });
    //         if (
    //             !findUser ||
    //             !(await aut.compare(req.body.passwd, findUser.passwd))
    //         ) {
    //             const error = new Error('Invalid user or password');
    //             error.name = 'UserAuthorizationError';
    //             next(error);
    //             return;
    //         }
    //         const tokenPayLoad: iTokenPayload = {
    //             id: findUser.id,
    //             name: findUser.name,
    //         };

    //         const token = aut.createToken(tokenPayLoad);
    //         res.setHeader('Content-type', 'application/json');
    //         res.status(201);
    //         res.send(JSON.stringify({ token, id: findUser.id }));
    //     };
}
