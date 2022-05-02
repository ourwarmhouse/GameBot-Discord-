import {bold} from '@discordjs/builders'
import {Message} from 'discord.js'
import MessageHandler from 'Handler/message'
import {MusicCommand} from '.'
import Music from '..'

export default class Repeat extends MusicCommand {
    constructor(_music: Music) {
        super(_music)
        this._name = this._name + ' repeat'
        this._alias = this._alias + ' r'
    }

    async execute(messageHandler: MessageHandler, message: Message) {
        try {
            const args = messageHandler.commandArgs[0]
            if (args == 'queue' || args == 'q') {
                this._music.queue.repeat()
                message.channel.send(bold('Current queue is repeating'))
            }

        } catch (e) {
            message.channel.send('Please try again !')
            console.error("Can't repeat")
        }
    }

}
