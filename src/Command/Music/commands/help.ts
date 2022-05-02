import { blockQuote } from '@discordjs/builders'
import { Message, MessageEmbed } from 'discord.js'
import MessageHandler from 'Handler/message'
import { MusicCommand } from '.'
import Music from '..'

export default class Help extends MusicCommand {
    constructor(_music: Music) {
        super(_music)
        this._name = this._name + ' help'
        this._alias = this._alias + ' h'
    }
    async execute(messageHandler: MessageHandler, message: Message) {
        try {
            const helpString = this.getHelpString()
            const content = new MessageEmbed()
                .addField('Music 🎸', helpString)
                .setColor('LUMINOUS_VIVID_PINK')
            message.reply({ embeds: [content] })
            
        } catch (e) {
            message.channel.send('Please try again !')
            console.log(e,"Can't send help")
        }
    }

    public getHelpString(): string {
        const { commands } = this._music
        const myHelpString = super.getHelpString()
        return commands.filter(c=>c != this).map(c => c.getHelpString()).join('\n') + '\n' + myHelpString
    }
}
