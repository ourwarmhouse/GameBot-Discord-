import mongoose from "mongoose";
export * from './Model/user'

export default class Database{
    static async connect() {
        try {
            if (!process.env.DATABASE_URL) throw new Error('Database url error')
            await mongoose.connect(process.env.DATABASE_URL)
            console.log('🌲 Connect Database successfully')
        }
        catch (e) {
            console.log(e || 'Connect database fail')
        }
    }
}