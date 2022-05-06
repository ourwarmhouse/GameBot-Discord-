import {inlineCode} from '@discordjs/builders'
import currency from 'currency.js'
import {Message} from 'discord.js'
import formatDuration from 'format-duration'
import message from 'Handler/message'
import {UserCommand} from '.'
import User from '..'
import Constant from '../../../Constant'

export default class Work extends UserCommand {
    private _amount = 1000
    constructor(userManager: User) {
        super(userManager)
        this._name = this._name + ' work'
        this._alias = this._alias + ' w'
    }
    async execute(messageHandler: message, message: Message<boolean>) {
        try {
            this._amount = Math.round(Math.random() * 1000)
            if (!message.guildId) throw new Error()
            const user = await this._userManager.getUser(
                message.author,
                message.guildId
            )

            if (!user) throw new Error()
            const duration = new Date().getTime() - user.lastWork.getTime()
            if (duration < Constant.MINUTE * 3) {
                message.reply(
                    'You must relax ' +
                        inlineCode(
                            formatDuration(Constant.MINUTE * 3 - duration)
                        ) +
                        ' before working'
                )
                return
            }
            const isReceived = await this._userManager.updateBalance(
                message.author,
                message.guildId,
                this._amount
            )
            if (!isReceived) throw new Error()
            await this._userManager.updateUser(
                message.author,
                message.guildId,
                {
                    lastWork: new Date(),
                }
            )
            message.reply(
                'You are a hard worker. This ' + currency(this._amount).format()
            ) + ' is your wage'
        } catch (e) {
            message.reply('Please try again !')
        }
    }
}
