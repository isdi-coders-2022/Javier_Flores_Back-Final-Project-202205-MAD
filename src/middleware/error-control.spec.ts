import { NextFunction, Request, Response } from 'express';
import { errorControl } from './error-control.js';

let req: Request;
let res: Partial<Response>;
let next: NextFunction;
let error: Error;

beforeEach(() => {
    (res = { send: jest.fn(), status: jest.fn() }),
        (error = {
            name: 'UserAuthorizationError',
            message: 'test',
        });
});
describe('Given the errorControl', () => {
    describe('When have a error', () => {
        test('Then res.status is called', () => {
            errorControl(error, req, res as Response, next);
            expect(res.status).toHaveBeenCalled();
        });
        test('Then resp.status is called', () => {
            errorControl(error, req, res as Response, next);
            expect(res.status).toHaveBeenCalled();
        });
        test('should first', () => {
            errorControl({} as Error, req, res as Response, next);
            expect(res.status).toHaveBeenCalled();
        });
    });
});
