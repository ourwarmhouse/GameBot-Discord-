import {bold} from '@discordjs/builders'
import {Message} from 'discord.js'
import MessageHandler from 'Handler/message'
import {MusicCommand} from '.'
import Music from '..'
import Disconnect from '../states/connection/disconnect'

export default class Leave extends MusicCommand {
    constructor(_music: Music) {
        super(_music)
        this._name = this._name + ' leave'
        this._alias = this._alias + ' l'
    }

    async execute(messageHandler: MessageHandler, message: Message) {
        try {
            this._music.changeConnectionState(new Disconnect())
            this._music.connectionState.disconnect()
        } catch (e) {
            console.log("Can't leave")
        }
    }

    public help(): void {}
}
