import {Message, MessageEmbed} from 'discord.js'
import message from 'Handler/message'
import Command from '.'

interface HelpField {
    title: string
    content: string
}

export default class Help extends Command {
    private _fieldList: HelpField[] = []
    constructor() {
        super()
        this._name = 'help'
        this._alias = 'h'
    }
    execute(messageHandler: message, message: Message<boolean>): void {
        try {
            const content = new MessageEmbed()
                .setColor('LUMINOUS_VIVID_PINK')
                .setTitle('🐱‍👓 Disney Land Bot !')
            this._fieldList.forEach((f) => content.addField(f.title, f.content))
            message.reply({embeds: [content]})
        } catch (e) {
            message.channel.send('Please try again !')
            console.log(e)
        }
    }

    addField(field: HelpField) {
        this._fieldList.push(field)
        return this
    }
}
