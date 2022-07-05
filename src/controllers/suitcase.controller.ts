import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { BasicController } from './basic.controller.js';
// import { iTokenPayload } from '../interfaces/token.js';
//import * as aut from '../services/authorization.js';
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
        resp: Response,
        next: NextFunction
    ) => {
        try {
            let user;
            try {
                user = await User.findById(req.body.owner);
            } catch (error) {
                next(error);
                return;
            }
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
            // Genero la resouesta
            resp.setHeader('Content-type', 'application/json');
            resp.status(201);
            resp.send(JSON.stringify(newSuitcase));
        } catch (error) {
            next(error); // ValidationError
        }
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
