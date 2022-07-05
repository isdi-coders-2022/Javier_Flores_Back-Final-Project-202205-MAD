import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
// import path from 'path'

//import homeRouter from './router/home.js';
import { suitcaseRouter } from './routers/suitcase.router.js';
import { userRouter } from './routers/user.router.js';
import { itemRouter } from './routers/item.router.js';
import { suggestionRouter } from './routers/suggestion.router.js';
import { errorControl } from './middleware/error-control.js';

export const app = express();

// Middlewares

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

//app.use('/', homeRouter);

app.use('/user', userRouter);
app.use('/users', userRouter);
app.use('/item', itemRouter);
app.use('/items', itemRouter);
app.use('/suitcase', suitcaseRouter);
app.use('/suitcases', suitcaseRouter);
app.use('/suggestion', suggestionRouter);

app.use(errorControl);
