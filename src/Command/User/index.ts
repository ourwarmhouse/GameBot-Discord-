import {ComamndManager} from '..'
import Help from './commands/help'
import {IUser, UserModel} from '../../Database/index'
import Cash from './commands/cash'
import Daily from './commands/daily'
import Rank from './commands/rank'
import Work from './commands/work'
import ListEmojis from './commands/listemojis'
import {User as DiscordUser} from 'discord.js'

export default class User extends ComamndManager {
    constructor() {
        super()
        this._helpCommand = new Help(this)
        this._commands = this._commands.concat([
            this._helpCommand,
            new Cash(this),
            new Daily(this),
            new Rank(this),
            new Work(this),
            new ListEmojis(this),
        ])
    }
    public async getUser(user: DiscordUser, serverId: string) {
        try {
            const userFromDatabase = await UserModel.findOne({
                userId: user.id,
                serverId,
            })
            if (!userFromDatabase) {
                const newUser = new UserModel({
                    userId: user.id,
                    username: user.username + '#' + user.discriminator,
                    serverId,
                })
                newUser.save()
                return null
            }
            return userFromDatabase
        } catch (e) {
            console.log(e)
            return null
        }
    }
    public async getListUser(serverId: string) {
        try {
            const listUser = await UserModel.find(
                {serverId},
                {},
                {sort: {balance: -1}}
            )

            return listUser
        } catch (e) {
            console.log(e)
            return []
        }
    }

    public async getBalance(user: DiscordUser, serverId: string) {
        try {
            const userFromDatabase = await this.getUser(user, serverId)
            if (!userFromDatabase)
                throw new Error("User doesn't exist in database")
            return userFromDatabase.balance
        } catch (e) {
            console.log(e)
            return 0
        }
    }
    public async updateBalance(
        user: DiscordUser,
        serverId: string,
        value: number
    ) {
        try {
            const userFromDatabase = await UserModel.findOne({
                userId: user.id,
                serverId,
            })
            if (!userFromDatabase)
                throw new Error("User doesn't exist in database")
            userFromDatabase.balance += value
            userFromDatabase.save()
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }
    public async updateUser(
        user: DiscordUser,
        serverId: string,
        userInfo: Partial<IUser>
    ) {
        try {
            const userFromDatabase = await UserModel.findOne({
                userId: user.id,
                serverId,
            })
            if (!userFromDatabase) return null
            const updatedUser = await UserModel.updateOne(
                {
                    userId: userFromDatabase.userId,
                    serverId: userFromDatabase.serverId,
                },
                userInfo
            )
            return updatedUser
        } catch (e) {
            console.log(e)
        }
    }
}
