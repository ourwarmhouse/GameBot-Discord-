import {inlineCode} from '@discordjs/builders'
import Constant from '../Constant'
import {Message} from 'discord.js'
import MessageHandler from 'Handler/message'
import {UserModel} from '../Database'
import currency from 'currency.js'

export class ComamndManager {
    protected _commands: Command[] = []
    protected _helpCommand!: Command
    public get commands() {
        return this._commands
    }
    public get helpCommand() {
        return this._helpCommand
    }
}

export default abstract class Command {
    protected _name!: string
    protected _alias!: string
    protected _price!: number

    abstract execute(messageHandler: MessageHandler, message: Message): void
    public getHelpString(): string {
        return (
            inlineCode(Constant.prefix + this._name) +
            '  (' +
            inlineCode(Constant.prefix + this._alias) +
            ')'
        )
    }
    public get price() {
        return this._price
    }
    public setPrice(newPrice: number) {
        this._price = newPrice
    }
    public async payForThisCommand(
        message: Message,
        userId: string,
        price: number
    ) {
        try {
            if (price == 0) return false

            const user = await UserModel.findOne({userId})
            if (!user) throw new Error("User doesn't exist in database")
            if (user.balance < price) {
                await message.reply(
                    "You don't have enough money to execute this command 🥱"
                )
                return false
            }

            user.balance = user.balance - price
            await message.reply(
                'You have ' +
                    inlineCode('-' + currency(price).format()) +
                    ' for this command'
            )
            user.save()
            return true
        } catch (e) {
            console.log(e)
            await message.reply('Please try again')
            return false
        }
    }
    public get name() {
        return this._name
    }
    public get alias() {
        return this._alias
    }
}
