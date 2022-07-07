/* istanbul ignore file */
import mongoose from 'mongoose';
import { mongooseConnect, RelationField } from '../db/mongoose.js';

(async () => {
    await mongooseConnect();
})();

/* eslint-disable no-unused-vars */
export interface iUser {
    id?: string;
    name: string;
    email: string;
    password: string;
    suitcases: Array<RelationField>;
}

const userSchema = new mongoose.Schema({
    name: { type: mongoose.SchemaTypes.String, required: true, unique: true },
    email: { type: mongoose.SchemaTypes.String, required: true, unique: true },
    password: { type: mongoose.SchemaTypes.String, required: true },
    suitcases: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Suitcase',
        },
    ],
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
        delete returnedObject.password;
    },
});

export const User = mongoose.model('User', userSchema);
