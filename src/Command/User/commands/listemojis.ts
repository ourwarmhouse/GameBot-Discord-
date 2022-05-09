import {inlineCode} from '@discordjs/builders'
import currency from 'currency.js'
import {Emoji, Message} from 'discord.js'
import formatDuration from 'format-duration'
import message from 'Handler/message'
import {UserCommand} from '.'
import User from '..'
import Constant from '../../../Constant'

export default class ListEmojis extends UserCommand {
    private _amount = 1000

    constructor(userManager: User) {
        super(userManager)
        this._name = this._name + ' listemojis'
        this._alias = this._alias + ' le'
    }
    async execute(messageHandler: message, message: Message<boolean>) {
        try {
            if (!message.guild) throw new Error()
            const emojiList2 = messageHandler.client.emojis.cache
                .map((e) => e.toString())
                .join(' ')
            const emojiList = message.guild.emojis.cache
                .map((e) => e.toString())
                .join(' ')

            // await message.channel.send(emojiList)
            await message.channel.send(emojiList2)
        } catch (e) {
            message.reply('Please try again !')
        }
    }
}
