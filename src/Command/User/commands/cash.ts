import UserManager from '..'
import {Message} from 'discord.js'
import message from 'Handler/message'
import {UserCommand} from '.'
import currency from 'currency.js'
import {bold, inlineCode} from '@discordjs/builders'

export default class Cash extends UserCommand {
    constructor(userManager: UserManager) {
        super(userManager)
        this._name = this._name + ' cash'
        this._alias = this._alias + ' c'
    }
    async execute(messageHandler: message, message: Message<boolean>) {
        try {
            const guildId = message.guildId
            if (!guildId) throw new Error()
            const balance = await this._userManager.getBalance(
                message.author,
                guildId
            )
            const balanceConverted = currency(balance).format()
            message.reply(
                bold('Your current balance ') + inlineCode(balanceConverted)
            )
        } catch (e) {
            console.log(e)
        }
    }
}
