import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { User } from '../models/user.model.js';
import { SuitcaseController } from './suitcase.controller.js';

jest.mock('../models/user.model.js');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
describe('Given a instantiated controller suitcaseController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction = jest.fn();

    const mockModel = {
        create: jest.fn(),
        find: jest.fn(),
        findById: jest.fn(),
        findOne: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndRemove: jest.fn(),
    };

    // TODO: Crear mockmodel con funciones mockeadas que imiten a las del modelo real

    let suitcaseController = new SuitcaseController(Model);
    beforeEach(() => {
        req = {
            params: {
                id: '1',
            },
            body: {
                owner: 'test',
            },
        };

        res = {
            setHeader: jest.fn(),
            send: jest.fn(),
            status: jest.fn(),
            json: jest.fn(),
        };
    });

    describe('When use getAllController', () => {
        test('Then should send a response', async () => {
            Model.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue({ test: 'test' }),
            });

            await suitcaseController.getAllController(
                req as Request,
                res as Response
            );
            expect(Model.find).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith({ test: 'test' });
        });
    });
    describe('When method getController is called', () => {
        test('And response is ok, then res.send should be called with data', async () => {
            const result = { test: 'test' };
            Model.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(result),
            });
            await suitcaseController.getController(
                req as Request,
                res as Response,
                next as NextFunction
            );
            expect(res.send).toHaveBeenCalledWith(JSON.stringify(result));
        });
        test('And response is not ok, then res.send should be called without data', async () => {
            const result = null;
            Model.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(result),
            });
            await suitcaseController.getController(
                req as Request,
                res as Response,
                next as NextFunction
            );
            expect(res.send).toHaveBeenCalledWith(JSON.stringify({}));
            expect(res.status).toHaveBeenCalledWith(404);
        });
        test('Then should be catch a error', async () => {
            Model.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockRejectedValue({}),
            });

            await suitcaseController.getController(
                req as Request,
                res as Response,
                next
            );

            expect(next).toHaveBeenCalled();
        });
    });

    describe('When method postController is called', () => {
        test('Then if not error res.send should be called with data', async () => {
            (User.findById as jest.Mock).mockResolvedValue({
                suitcases: [],
                save: jest.fn(),
            });
            const mockSuitcase = {
                destination: 'beach',
                owner: 'test',
                items: [],
                isWeightOk: false,
            };
            Model.create = jest.fn().mockResolvedValue(mockSuitcase);
            await suitcaseController.postController(
                req as Request,
                res as Response,
                next as NextFunction
            );
            expect(Model.create).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalled();
        });
        test('Then if error next  should be called ', async () => {
            (User.findById as jest.Mock).mockResolvedValue(null);

            Model.create = jest.fn().mockRejectedValue({});
            await suitcaseController.postController(
                req as Request,
                res as Response,
                next as NextFunction
            );

            expect(next).toHaveBeenCalled();
            expect(User.findById).toHaveBeenCalled();
        });
        test('Then if error next  should be called ', async () => {
            (User.findById as jest.Mock).mockResolvedValue({
                suitcases: [],
                save: jest.fn(),
            });

            mockModel.create.mockImplementationOnce(async () => {
                throw new Error();
            });

            await suitcaseController.postController(
                req as Request,
                res as Response,
                next as NextFunction
            );

            expect(next).toHaveBeenCalled();
            expect(User.findById).toHaveBeenCalled();
        });
        describe('When method patchController is called', () => {
            test('Then resp.send should be called with data', async () => {
                const result = { test: 'test' };
                Model.findByIdAndUpdate = jest.fn().mockResolvedValue(result);
                await suitcaseController.patchController(
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
                await suitcaseController.deleteController(
                    req as Request,
                    res as Response
                );
                expect(res.status).toHaveBeenCalledWith(202);
                expect(res.send).toHaveBeenCalledWith(JSON.stringify(result));
            });
            describe('When method deleteController is called with incorrect id', () => {
                test('Then res.status should be called with status 404', async () => {
                    const result = null;
                    Model.findByIdAndDelete = jest
                        .fn()
                        .mockResolvedValue(result);
                    await suitcaseController.deleteController(
                        req as Request,
                        res as Response
                    );
                    expect(res.status).toHaveBeenCalledWith(404);
                });
            });
        });
    });
});
