import { Router } from 'express';
import { BasicController } from '../controllers/basic.controller.js';
import { Item } from '../models/item.model.js';

export const itemController = new BasicController(Item);
export const itemRouter = Router();

itemRouter.get('/', itemController.getAllController);
itemRouter.get('/:id', itemController.getController);
itemRouter.post('/', itemController.postController);
itemRouter.patch(
    '/:id',
    // loginRequired,
    itemController.patchController
);
