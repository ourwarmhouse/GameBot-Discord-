import {inlineCode} from '@discordjs/builders'
import currency from 'currency.js'
import {Message} from 'discord.js'
import MessageHandler from 'Handler/message'
import {UserCommand} from '.'
import User from '..'
import Constant from '../../../Constant'

export default class Give extends UserCommand {
    constructor(userManager: User) {
        super(userManager)
        this._name = this._name + ' give'
        this._alias = this._alias + ' g'
    }
    async execute(messageHandler: MessageHandler, message: Message<boolean>) {
        try {
            const toUserTag = messageHandler.commandArgs[0]
            const toUserId = toUserTag.slice(2, -1)
            let balance = messageHandler.commandArgs[1]
            if (!message.guildId) throw new Error()

            if (
                (isNaN(Number(balance)) || Number(balance) <= 0) &&
                balance != 'all' &&
                balance != 'a'
            ) {
                message.reply('Type valid balance to transfer')
                throw new Error()
            }
            const fromUser = await this._userManager.findUser(
                message.author.id,
                message.guildId
            )
            if (!fromUser) throw new Error()
            if (
                Number(balance) > fromUser.balance ||
                balance == 'all' ||
                balance == 'a'
            ) {
                balance = fromUser.balance.toString()
            }

            const toUser = await this._userManager.findUser(
                toUserId,
                message.guildId
            )
            if (!toUser) throw new Error()

            const isTransfered = await this._userManager.updateBalance(
                fromUser.userId,
                message.guildId,
                -balance
            )
            if (isTransfered) {
                const isReceived = await this._userManager.updateBalance(
                    toUser.userId,
                    message.guildId,
                    Number(balance)
                )
                if (isReceived) {
                    message.reply(
                        'Transfer to ' +
                            toUserTag +
                            ' ' +
                            inlineCode(currency(Number(balance)).format()) +
                            ' successfully'
                    )
                } else {
                    message.reply('Fail to transfer')
                }
            }
        } catch (e) {
            message.reply('Please try again !')
        }
    }
    public getHelpString(): string {
        return (
            inlineCode(
                Constant.prefix + this._name + " @tag [number | 'all' | 'a']"
            ) +
            ' (' +
            inlineCode(this.alias + " @tag [number | 'all' | 'a']") +
            ')'
        )
    }
}
