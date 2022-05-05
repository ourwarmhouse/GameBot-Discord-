import {inlineCode} from '@discordjs/builders'
import currency from 'currency.js'
import {Message, MessageEmbed} from 'discord.js'
import MessageHandler from 'Handler/message'
import {UserCommand} from '.'
import UserManager from '..'

export default class Rank extends UserCommand {
    constructor(userManager: UserManager) {
        super(userManager)
        this._name = this._name + ' rank'
        this._alias = this._alias + ' r'
    }
    async execute(messageHandler: MessageHandler, message: Message) {
        try {
            if (!message.guildId || !message.guild) return
            const listUser = await this._userManager.getListUser(
                message.guildId
            )
            const content = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('Billionaires | ' + message.guild.name)
                .setDescription(
                    listUser
                        .map(
                            (u, idx) =>
                                inlineCode('#' + (idx + 1)) +
                                ' | ' + u.username + ' ' +
                                inlineCode(`(${currency(u.balance).format()})`)
                        )
                        .join('\n')
                )
            message.reply({embeds: [content]})
        } catch (e) {
            message.channel.send('Please try again !')
            console.log(e)
        }
    }
}
