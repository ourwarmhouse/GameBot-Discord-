import {Message} from 'discord.js'
import MessageHandler from 'Handler/message'

export default abstract class Command {
    protected _name!: string
    protected _alias!: string

    abstract execute(messageHandler: MessageHandler, message: Message): void
    abstract help(): void
    public get name() {
        return this._name
    }
    public get alias() {
        return this._alias
    }
}
