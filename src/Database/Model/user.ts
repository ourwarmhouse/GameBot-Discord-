import {Document, Schema, model} from 'mongoose'
import Constant from '../../Constant'

export interface IUser extends Document {
    userId: string
    balance: number
    lastDaily: Date
}

const UserSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        balance: {
            type: Number,
            default: 0,
        },
        lastDaily: {
            type: Date,
            default: () =>
                new Date(new Date().getTime() - 24 * Constant.ONE_HOUR),
        },
    },
    {
        versionKey: false,
    }
)

export const UserModel = model<IUser>('User', UserSchema)
