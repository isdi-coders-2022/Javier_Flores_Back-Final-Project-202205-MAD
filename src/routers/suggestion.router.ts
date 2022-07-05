import { Router } from 'express';
import { Item } from '../models/item.model.js';
import { SuggestionController } from '../controllers/suggestion.controller.js';

export const suggestionController = new SuggestionController(Item);
export const suggestionRouter = Router();

suggestionRouter.get('/', suggestionController.getAllSuggestController);
