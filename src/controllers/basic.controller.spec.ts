import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { BasicController } from './basic.controller.js';

describe('Given a instantiated controller BasicController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction = jest.fn();

    let basicController = new BasicController(Model);
    beforeEach(() => {
        req = {
            params: { id: '1' },
        };
        res = {
            setHeader: jest.fn(),
            status: jest.fn(),
            send: jest.fn(),
        };
    });
    describe('When method getAllController is called', () => {
        test('Then resp.send should be called', async () => {
            (Model.find = jest.fn().mockReturnValue({
                task: 'test',
            })),
                await basicController.getAllController(
                    req as Request,
                    res as Response
                );
            expect(Model.find).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith({ task: 'test' });
        });
    });

    describe('When method getController is called', () => {
        test('And response is ok, then resp.send should be called with data', async () => {
            const result = { test: 'test' };
            Model.findById = jest.fn().mockResolvedValue(result);
            await basicController.getController(
                req as Request,
                res as Response,
                next as NextFunction
            );
            expect(res.send).toHaveBeenCalledWith(JSON.stringify(result));
        });
        test('And response is not ok, then resp.send should be called without data', async () => {
            const result = null;
            Model.findById = jest.fn().mockResolvedValue(result);
            await basicController.getController(
                req as Request,
                res as Response,
                next as NextFunction
            );
            expect(res.send).toHaveBeenCalledWith(JSON.stringify({}));
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('When method postController is called', () => {
        test('Then resp.send should be called with data', async () => {
            const result = { test: 'test' };
            Model.create = jest.fn().mockResolvedValue(result);
            await basicController.postController(
                req as Request,
                res as Response,
                next as NextFunction
            );
            expect(res.send).toHaveBeenCalledWith(JSON.stringify(result));
        });
        test('Then in the case of error, next should be called', async () => {
            const error = new Error('test');
            Model.create = jest.fn().mockRejectedValue(error);
            await basicController.postController(
                req as Request,
                res as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalledWith(error);
        });

        describe('When method patchController is called', () => {
            test('Then resp.send should be called with data', async () => {
                const result = { test: 'test' };
                Model.findByIdAndUpdate = jest.fn().mockResolvedValue(result);
                await basicController.patchController(
                    req as Request,
                    res as Response
                );
                expect(res.send).toHaveBeenCalledWith(JSON.stringify(result));
            });
        });

        describe('When method deleteController is called', () => {
            test('Then res.status should be called with status', async () => {
                const result = { status: 202 };
                Model.findByIdAndDelete = jest.fn().mockResolvedValue(result);
                await basicController.deleteController(
                    req as Request,
                    res as Response
                );
                expect(res.status).toHaveBeenCalledWith(202);
            });
        });
    });
});

