import {Message} from 'discord.js'
import MessageHandler from 'Handler/message'
import {MusicCommand} from '.'
import Music from '..'

export default class Leave extends MusicCommand {
    constructor(_music: Music) {
        super(_music)
        this._name = this._name + ' leave'
        this._alias = this._alias + ' l'
    }

    async execute(messageHandler: MessageHandler, message: Message) {
        try {
            this._music.clickLeave()
        } catch (e) {
            message.channel.send('Please try again !')
            console.log("Can't leave")
        }
    }
}
