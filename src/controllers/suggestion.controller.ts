import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { Item } from '../models/item.model.js';
import { BasicController } from './basic.controller.js';

export class SuggestionController<T> extends BasicController<T> {
    constructor(public model: Model<T>) {
        super(model);
    }

    getAllSuggestController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { destination } = req.query;
        try {
            const itemByDestination: Array<any> = await Item.find({
                destination,
            });
            const selectedItems = itemByDestination.reduce((acc, item) => {
                acc[item.name] = ++acc[item.name] || 0;
                return acc;
            }, {});

            const popular = itemByDestination.filter((item) => {
                return selectedItems[item.name];
            });

            const myFilteredArr = popular.reduce(
                (prev, curr) =>
                    prev.find(
                        (item: { name: string }) => item.name === curr.name
                    )
                        ? prev
                        : [...prev, curr],
                []
            );

            res.setHeader('Content-type', 'application/json');
            res.send(myFilteredArr);
        } catch (err) {
            next(err);
        }
    };
}
