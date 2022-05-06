import {Document, Schema, model} from 'mongoose'
import Constant from '../../Constant'

export interface IUser extends Document {
    userId: string
    username: string
    serverId: string
    balance: number
    lastWork: Date
    lastDaily: Date
}

const UserSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        serverId: {
            type: String,
            required: true,
        },
        balance: {
            type: Number,
            default: 0,
        },
        lastDaily: {
            type: Date,
            default: () => new Date(new Date().getTime() - 24 * Constant.HOUR),
        },
        lastWork: {
            type: Date,
            default: () => new Date(new Date().getTime() - 3 * Constant.MINUTE),
        },
    },
    {
        versionKey: false,
    }
)

export const UserModel = model<IUser>('User', UserSchema)
