import { Router } from 'express';
import { Suitcase } from '../models/suitcase.model.js';

import { SuitcaseController } from '../controllers/suitcase.controller.js';
// import { userRequiredForSuitcase } from '../middleware/user-required.js';
// import { loginRequired } from '../middleware/login-required.js';

export const suitcaseController = new SuitcaseController(Suitcase);
export const suitcaseRouter = Router();

suitcaseRouter.get('/', suitcaseController.getAllController);
suitcaseRouter.get('/:id', suitcaseController.getController);
suitcaseRouter.post('/', suitcaseController.postController);
suitcaseRouter.patch(
    '/:id',
    // loginRequired,
    // userRequiredForSuitcase,
    suitcaseController.patchController
);
suitcaseRouter.delete(
    '/:id',
    // loginRequired,
    // userRequiredForSuitcase,
    suitcaseController.deleteController
);
