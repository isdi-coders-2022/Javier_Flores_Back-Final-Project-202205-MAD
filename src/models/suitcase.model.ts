import mongoose from 'mongoose';
import { mongooseConnect, RelationField } from '../db/mongoose.js';
import { destination } from './item.model.js';

(async () => {
    await mongooseConnect();
})();

/* eslint-disable no-unused-vars */
export interface iSuitcase {
    id?: string;
    destination: destination;
    owner: RelationField;
    items: [
        {
            item: RelationField;
            quantity: number;
            isChecked: boolean;
        }
    ];
    isWeightOk: boolean;
}

const suitcaseSchema = new mongoose.Schema({
    destination: { type: mongoose.SchemaTypes.String, required: true },
    owner: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    items: [
        {
            item: {
                type: mongoose.Types.ObjectId,
                ref: 'Item',
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
