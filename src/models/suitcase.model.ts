/* istanbul ignore file */
import mongoose from 'mongoose';
import { mongooseConnect, RelationField } from '../db/mongoose.js';
import { destination } from './item.model.js';

(async () => {
    await mongooseConnect();
})();

/* eslint-disable no-unused-vars */
export interface iSuitcase {
    id?: string;
    limitWeight: number;
    destination?: destination;
    owner: RelationField | null;
    items?: [
        {
            item: RelationField | null;
            quantity: number;
            isChecked: boolean;
        }
    ];
    isWeightOk: boolean;
}

const suitcaseSchema = new mongoose.Schema({
    limitWeight: {
        type: Number,
        required: true,
        min: 0,
    },
    destination: { type: mongoose.SchemaTypes.String, required: true },
    owner: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
    items: [
        {
            item: {
                type: mongoose.Types.ObjectId,
                ref: 'Item',
            },
            quantity: { type: mongoose.SchemaTypes.Number },
            isChecked: { type: mongoose.SchemaTypes.Boolean },
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
