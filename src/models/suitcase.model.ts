import mongoose from 'mongoose';

import { destination, iItem } from './item.model.js';

/* eslint-disable no-unused-vars */
export interface iSuitcase {
    id?: string;
    destination: destination;
    items: Array<{
        item: iItem;
        quantity: number;
        isChecked: boolean;
    }>;
    isWeightOk: boolean;
}

const suitcaseSchema = new mongoose.Schema({
    destination: { type: mongoose.SchemaTypes.String, required: true },
    items: [
        {
            item: {
                name: { type: mongoose.SchemaTypes.String, required: true },
                weight: { type: mongoose.SchemaTypes.Number, required: true },
            },
            quantity: { type: mongoose.SchemaTypes.Number, required: true },
            isChecked: { type: mongoose.SchemaTypes.Boolean, required: true },
        },
    ],
    isWeightOk: { type: mongoose.SchemaTypes.Boolean, required: true },
});

suitcaseSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
    },
});

export const Suitcase = mongoose.model('Suitcase', suitcaseSchema);
