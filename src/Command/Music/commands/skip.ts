import {Message} from 'discord.js'
import MessageHandler from 'Handler/message'
import {MusicCommand} from '.'
import Music from '..'

export default class Skip extends MusicCommand {
    constructor(_music: Music) {
        super(_music)
        this._name = this._name + ' skip'
        this._alias = this._alias + ' s'
    }

    async execute(messageHandler: MessageHandler, message: Message) {
        try {
            this._music.clickSkip()
        } catch (e) {
            message.channel.send('Please try again !')
            console.error("Can't skip the song")
        }
    }
}
