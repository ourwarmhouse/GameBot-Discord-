import User from '..'
import {Message} from 'discord.js'
import message from 'Handler/message'
import {UserCommand} from '.'
import currency from 'currency.js'
import {bold, inlineCode, italic} from '@discordjs/builders'
import Constant from '../../../Constant'
import formatDuration from 'format-duration'

export default class Daily extends UserCommand {
    private _amount = 10000
    private _limitTime = Constant.HOUR * 24
    constructor(userManager: User) {
        super(userManager)
        this._name = this._name + ' daily'
        this._alias = this._alias + ' d'
    }
    async execute(messageHandler: message, message: Message<boolean>) {
        try {
            messageHandler.commandArgs
            const guildId = message.guildId
            if (!guildId) throw new Error()
            const user = await this._userManager.getOrCreateUser(
                message.author,
                guildId
            )
            if (!user) throw new Error()
            const duration = new Date().getTime() - user.lastDaily.getTime()
            if (duration < this._limitTime) {
                message.reply(
                    'You must wait ' +
                        inlineCode(formatDuration(this._limitTime - duration)) +
                        ' to receive daily gift'
                )
                return
            }
            const isReceived = await this._userManager.updateBalance(
                message.author.id,
                guildId,
                this._amount
            )
            if (!isReceived) throw new Error()
            await this._userManager.updateUser(message.author.id, guildId, {
                lastDaily: new Date(),
            })
            const amountConverted = currency(this._amount).format()
            const balanceConverted = currency(
                this._amount + user.balance
            ).format()
            message.reply(
                bold('You have received ') +
                    inlineCode('+' + amountConverted) +
                    '\n' +
                    italic('Your current balance ') +
                    inlineCode(balanceConverted)
            )
        } catch (e) {
            message.reply('Please try again !')
        }
    }
}
