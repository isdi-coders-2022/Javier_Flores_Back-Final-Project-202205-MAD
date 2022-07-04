import mongoose from 'mongoose';
export interface iItem {
    name: string;
    weight: number;
}

const itemSchema = new mongoose.Schema({
    name: { type: mongoose.SchemaTypes.String, required: true },
    weight: { type: mongoose.SchemaTypes.Number, required: true },
});

itemSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
    },
});

export const Item = mongoose.model('Item', itemSchema);
