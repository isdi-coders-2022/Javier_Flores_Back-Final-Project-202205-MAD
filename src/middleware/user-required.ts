import { NextFunction, Request, Response } from 'express';
import { ExtRequest } from '../interfaces/token.js';
import { Suitcase } from '../models/suitcase.model.js';
// import { User } from '../models/user.model.js';

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
        console.log(userID, findSuitcase?.owner);
    }
};
//Add Requirer user for delete user!!
// export const userRequiredForUser = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     // el usuario tiene acceso al recurso (e.g. Tarea)

//     const userID = (req as unknown as ExtRequest).tokenPayload.id;
//     const findUser = await User.findById(req.params.id);
//     if (findUser?.responsible === userID) {
//         next();
//     } else {
//         const error = new Error();
//         error.name = 'UserAuthorizationError';
//         next(error);
//     }
// };
