import {ComamndManager} from '..'
import Help from './commands/help'
import {IUser, UserModel} from '../../Database/index'
import Cash from './commands/cash'
import Daily from './commands/daily'

export default class User extends ComamndManager {
    constructor() {
        super()
        this._helpCommand = new Help(this)
        this._commands = this._commands.concat([
            this._helpCommand,
            new Cash(this),
            new Daily(this),
        ])
    }
    public async getUser(userId: string) {
        try {
            const user = await UserModel.findOne({userId})
            if (!user) {
                const newUser = new UserModel({userId})
                newUser.save()
                return newUser
            }
            return user
        } catch (e) {
            console.log(e)
            return null
        }
    }

    public async getBalance(userId: string) {
        try {
            const user = await this.getUser(userId)
            if (!user) throw new Error("User doesn't exist in database")
            return user.balance
        } catch (e) {
            console.log(e)
            return 0
        }
    }
    public async updateBalance(userId: string, value: number) {
        try {
            const user = await this.getUser(userId)
            if (!user) throw new Error("User doesn't exist in database")
            await UserModel.findOneAndUpdate(
                {userId},
                {balance: user.balance + value}
            )
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }
    public async updateUser(userId: string, userInfo: Partial<IUser>) {
        try {
            const user = await UserModel.findOneAndUpdate({userId}, userInfo, {
                upsert: true,
            })
            return user
        } catch (e) {
            console.log(e)
        }
    }
}
