import { Document,Schema,model } from 'mongoose'

export interface IUser extends Document{
    userId: string
    balance: number
}

const UserSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0
    }
}, {
    versionKey:false
})

export const UserModel = model<IUser>('User', UserSchema)
