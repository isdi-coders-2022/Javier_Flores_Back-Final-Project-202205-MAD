//Maybe will be a problem with SchemaType of Destination!!
/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';

export enum destination {
    'beach' = 'beach',
    'campsite' = 'campsite',
    'mountain' = 'mountain',
    'rainy' = 'rainy',
}

export interface iItem {
    name: string;
    weight: number;
    destination: destination;
}

const itemSchema = new mongoose.Schema({
    name: { type: mongoose.SchemaTypes.String, required: true },
    weight: { type: mongoose.SchemaTypes.Number, required: true },
    destination: { type: mongoose.SchemaTypes.String, required: true },
});

itemSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
    },
});

export const Item = mongoose.model('Item', itemSchema);
