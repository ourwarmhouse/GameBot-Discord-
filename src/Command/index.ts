import { inlineCode } from '@discordjs/builders'
import Constant from '../Constant'
import {Message} from 'discord.js'
import MessageHandler from 'Handler/message'
import { UserModel } from '../Database'


export class ComamndManager{
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
        return inlineCode(Constant.prefix + this._name) + '  (' + inlineCode(Constant.prefix + this._alias)+ ')'
    }
    public get price() { return this._price }
    public setPrice(newPrice: number) { this._price = newPrice }
    public async payForThisCommand(userId: string,newPrice: number) {
        if (newPrice < 0) return
        console.log(userId,newPrice)
        const user = await UserModel.findOneAndUpdate({ userId }, { newPrice }, { upsert: true })
        if (!user)
            throw new Error("User doesn't exist in database")
        
    }
    public get name() {
        return this._name
    }
    public get alias() {
        return this._alias
    }
}
