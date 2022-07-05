import { Router } from 'express';
//import { loginRequired } from '../middleware/login-required.js';
import { BasicController } from '../controllers/basic.controller.js';
import { Item } from '../models/item.model.js';
//import { userRequiredForTasks } from '../middleware/user-required.js';

export const itemController = new BasicController(Item);
export const itemRouter = Router();

itemRouter.get('/', itemController.getAllController);
itemRouter.get('/:id', itemController.getController);
itemRouter.post('/', itemController.postController);
// itemRouter.patch('/complete/:id', itemController.completeController);
// itemRouter.patch(
//     '/:id',
//     loginRequired,
//     userRequiredForTasks,
//     itemController.patchController
// );
itemRouter.delete(
    '/:id',
    // loginRequired,
    //userRequiredForTasks,
    itemController.deleteController
);
