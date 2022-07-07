import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserController } from './user.controller.js';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Given a instantiated controller UserController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction = jest.fn();

    let userController = new UserController(Model);
    beforeEach(() => {
        req = {
            params: {
                id: '1',
            },
            body: {
                token: '2',
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

            await userController.getAllController(
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
            await userController.getController(
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
            await userController.getController(
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

            await userController.getController(
                req as Request,
                res as Response,
                next
            );

            expect(next).toHaveBeenCalled();
        });
    });

    describe('When method postController is called', () => {
        test('Then if not error resp.send should be called with data', async () => {
            const mockResult = { test: 'test' };
            req = { body: { pwd: 'test' } };
            Model.create = jest.fn().mockResolvedValue(mockResult);
            await userController.postController(
                req as Request,
                res as Response,
                next as NextFunction
            );
            expect(res.send).toHaveBeenCalledWith(JSON.stringify(mockResult));
        });
        test('Then if error next  should be called ', async () => {
            req = { body: { pwd: 'test' } };
            Model.create = jest.fn().mockRejectedValue(null);
            await userController.postController(
                req as Request,
                res as Response,
                next as NextFunction
            );
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When method loginController is called', () => {
        test('Then should send a response and status 201', async () => {
            Model.findOne = jest.fn().mockReturnValue({});
            bcrypt.compare = jest.fn().mockResolvedValue(true);
            jwt.sign = jest.fn().mockReturnValue({});

            await userController.loginController(
                req as Request,
                res as Response,
                next as NextFunction
            );
            expect(Model.findOne).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });
        test('Then in the case of error, next should be called', async () => {
            Model.findOne = jest.fn().mockReturnValue({});
            bcrypt.compare = jest.fn().mockResolvedValue(false);
            jwt.sign = jest.fn().mockReturnValue({});

            await userController.loginController(
                req as Request,
                res as Response,
                next as NextFunction
            );
            expect(Model.findOne).toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        });
    });

    describe('When method patchController is called', () => {
        test('Then resp.send should be called with data', async () => {
            const result = { test: 'test' };
            Model.findByIdAndUpdate = jest.fn().mockResolvedValue(result);
            await userController.patchController(
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
            await userController.deleteController(
                req as Request,
                res as Response
            );
            expect(res.status).toHaveBeenCalledWith(202);
            expect(res.send).toHaveBeenCalledWith(JSON.stringify(result));
        });
        describe('When method deleteController is called with incorrect id', () => {
            test('Then res.status should be called with status 404', async () => {
                const result = null;
                Model.findByIdAndDelete = jest.fn().mockResolvedValue(result);
                await userController.deleteController(
                    req as Request,
                    res as Response
                );
                expect(res.status).toHaveBeenCalledWith(404);
            });
        });
    });
});
