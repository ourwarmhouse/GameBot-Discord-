import {joinVoiceChannel} from '@discordjs/voice'
import {Message} from 'discord.js'
import State from '.'

export default class Ready extends State {
    constructor() {
        super()
        this._isConnect = true
    }
    override subscribeAudio(): boolean {
        if (!this._music.connection) return false
        this._music.connection.subscribe(this._music.player)
        return true
    }
}
