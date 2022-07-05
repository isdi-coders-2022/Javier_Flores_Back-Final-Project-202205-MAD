import { NextFunction, Request, Response } from 'express';
import { ExtRequest } from '../interfaces/token.js';
import { Suitcase } from '../models/suitcase.model.js';

export const userRequiredForSuitcase = async (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    // el usuario tiene acceso al recurso (e.g. Tarea)

    const userID = (req as unknown as ExtRequest).tokenPayload.id;
    const findSuitcase = await Suitcase.findById(req.params.id);
    if (findSuitcase?.owner === userID) {
        next();
    } else {
        const error = new Error();
        error.name = 'UserAuthorizationError';
        next(error);
    }
};
