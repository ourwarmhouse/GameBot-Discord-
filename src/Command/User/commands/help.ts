import {blockQuote} from '@discordjs/builders'
import {Message, MessageEmbed} from 'discord.js'
import MessageHandler from 'Handler/message'
import {UserCommand} from '.'
import User from '..'

export default class Help extends UserCommand {
    constructor(userManager: User) {
        super(userManager)
        this._name = this._name + ' help'
        this._alias = this._alias + ' h'
    }
    async execute(messageHandler: MessageHandler, message: Message) {
        try {
            const helpString = this.getHelpString()
            const content = new MessageEmbed()
                .addField('User 🤡', helpString)
                .setColor('LUMINOUS_VIVID_PINK')
            message.reply({embeds: [content]})
        } catch (e) {
            message.channel.send('Please try again !')
            console.log(e, "Can't send help")
        }
    }

    public getHelpString(): string {
        const {commands} = this._userManager
        const myHelpString = super.getHelpString()
        return (
            commands
                .filter((c) => c != this)
                .map((c) => c.getHelpString())
                .join('\n') +
            '\n' +
            myHelpString
        )
    }
}
