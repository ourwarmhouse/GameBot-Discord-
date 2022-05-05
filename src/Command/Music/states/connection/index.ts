import {joinVoiceChannel} from '@discordjs/voice'
import {Message} from 'discord.js'
import State from '..'

export default abstract class ConnectionState extends State {
    protected _isConnect = false
    public connect(message: Message<boolean>) {}
    public subscribeAudio(): boolean {
        return false
    }
    public disconnect(): boolean {
        return false
    }
    public get isConnect() {
        return this._isConnect
    }
}
