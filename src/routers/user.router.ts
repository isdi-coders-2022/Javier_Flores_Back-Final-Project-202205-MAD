import { Router } from 'express';
import { User } from '../models/user.model.js';
import { UserController } from '../controllers/user.controller.js';
import { loginRequired } from '../middleware/login-required.js';
import { userRequiredForUser } from '../middleware/user-required.js';

export const userController = new UserController(User);
export const userRouter = Router();

userRouter.get('/', userController.getAllController);
userRouter.get('/:id', userController.getController);
userRouter.post('/', userController.postController); // registro
userRouter.post('/login', userController.loginController);
userRouter.patch(
    '/:id',

    loginRequired,
    userRequiredForUser,
    userController.patchController
);
userRouter.delete(
    '/:id',

    loginRequired,
    userRequiredForUser,
    userController.deleteController
);
