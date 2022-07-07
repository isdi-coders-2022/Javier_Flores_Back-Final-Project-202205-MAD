import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { destination, Item } from '../models/item.model';
import { SuggestionController } from './suggestion.controller';
describe('Given a SuggestionController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction = jest.fn();

    let suggestionController = new SuggestionController(Model);

    describe('When getAllSuggestController is called', () => {
        beforeEach(() => {
            req = { query: destination };
            res = {
                send: jest.fn(),
                setHeader: jest.fn(),
            };
        });
        test('Then should call res.send', async () => {
            // eslint-disable-next-line no-unused-vars
            let arrayDestination = (Model.find = jest
                .fn()
                .mockResolvedValue(['beach', 'rainy']));

            await suggestionController.getAllSuggestController(
                req as Request,
                res as Response,
                next
            );
            expect(res.send).toHaveBeenCalled();
        });
        test('Then if error should call next', async () => {
            Item.find = jest.fn().mockRejectedValue({});
            await suggestionController.getAllSuggestController(
                req as Request,
                res as Response,
                next
            );
            expect(next).toHaveBeenCalled();
        });
    });
});
