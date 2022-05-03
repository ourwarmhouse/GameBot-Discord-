import {Message, MessageEmbed} from 'discord.js'
import MessageHandler from 'Handler/message'
import {GameCommand} from '.'
import Game from '..'

export default class Help extends GameCommand {
    constructor(gameManager: Game) {
        super(gameManager)
        this._name = this._name + ' help'
        this._alias = this._alias + ' h'
    }
    async execute(messageHandler: MessageHandler, message: Message) {
        try {
            const helpString = this.getHelpString()
            const content = new MessageEmbed()
                .addField('Game 🎪', helpString)
                .setColor('LUMINOUS_VIVID_PINK')
            message.reply({embeds: [content]})
        } catch (e) {
            message.channel.send('Please try again !')
            console.log(e, "Can't send help")
        }
    }

    public getHelpString(): string {
        const {commands} = this._gameManager
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
