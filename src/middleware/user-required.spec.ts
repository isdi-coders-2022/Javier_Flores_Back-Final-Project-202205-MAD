import { NextFunction, Response, Request } from 'express';
import { ExtRequest } from '../interfaces/token';
import { Suitcase } from '../models/suitcase.model.js';
import { userRequiredForSuitcase } from './user-required.js';

jest.mock('jsonwebtoken');
describe('Given the middleware user-required', () => {
    let req: Partial<ExtRequest>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        (req = {
            params: { id: '1' },
            get: jest.fn(),
            tokenPayload: { id: '1' },
        }),
            (next = jest.fn());
    });
    describe('When use userRequiredForSuitcase with valid token', () => {
        test('Then should call next', async () => {
            Suitcase.findById = jest.fn().mockReturnValue({ id: '1' });
            req.get = jest.fn().mockReturnValue('bearer token');
            await userRequiredForSuitcase(
                req as Request,
                res as Response,
                next
            );
            expect(next).toHaveBeenCalled();
        });

        test('Then should call next with an error', async () => {
            const error = new Error();
            error.name = 'UserAuthorizationError';
            Suitcase.findById = jest.fn().mockReturnValue(null);
            req.get = jest.fn().mockReturnValue('bearer token');
            await userRequiredForSuitcase(
                req as Request,
                res as Response,
                next
            );
            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
