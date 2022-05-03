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
    constructor(userManager: User) {
        super(userManager)
        this._name = this._name + ' daily'
        this._alias = this._alias + ' d'
    }
    async execute(messageHandler: message, message: Message<boolean>) {
        try {
            const userId = message.author.id
            const user = await this._userManager.getUser(userId)
            if (!user) throw new Error()
            const duration = new Date().getTime() - user.lastDaily.getTime()
            if (duration < Constant.ONE_HOUR * 24) {
                message.reply(
                    'You must waiting ' +
                        inlineCode(
                            formatDuration(Constant.ONE_HOUR * 24 - duration)
                        ) +
                        ' to receive daily gift'
                )
                return
            }
            const isReceived = await this._userManager.updateBalance(
                userId,
                this._amount
            )
            if (!isReceived) throw new Error()
            await this._userManager.updateUser(userId, {lastDaily: new Date()})
            const amountConverted = currency(this._amount).format()
            const balanceConverted = currency(
                this._amount + user.balance
            ).format()
            message.reply(
                bold('You have received ') +
                    inlineCode('+' + amountConverted) +
                    +italic('Your current balance ') +
                    inlineCode(balanceConverted)
            )
        } catch (e) {
            message.reply('Please try again !')
        }
    }
}
