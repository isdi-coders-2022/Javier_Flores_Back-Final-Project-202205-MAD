import { NextFunction, Request, Response } from 'express';
import { ExtRequest } from '../interfaces/token.js';
import { Suitcase } from '../models/suitcase.model.js';
import { User } from '../models/user.model.js';

export const userRequiredForSuitcase = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userID = (req as unknown as ExtRequest).tokenPayload.id;
    const findSuitcase = await Suitcase.findById(req.params.id);
    if (userID === String(findSuitcase?.owner)) {
        next();
    } else {
        const error = new Error();
        error.name = 'UserAuthorizationError';
        next(error);
    }
};

export const userRequiredForUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userID = (req as unknown as ExtRequest).tokenPayload.id;
    const findUser = await User.findById(req.params.id);
    if (String(findUser?.id) === userID) {
        next();
    } else {
        const error = new Error();
        error.name = 'UserAuthorizationError';

        next(error);
    }
};
