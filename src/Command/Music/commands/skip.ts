import { Message } from 'discord.js'
import MessageHandler from 'Handler/message'
import { MusicCommand } from '.'
import Music from '..'
import AudioIdle from '../states/audio/idle'

export default class Skip extends MusicCommand {
    constructor(_music: Music) {
        super(_music)
        this._name = this._name + ' skip'
        this._alias = this._alias + ' s'
    }

    async execute(messageHandler: MessageHandler, message: Message) {
        try {
            
            // const queue = this._music.queue
            // const oldSong = queue.current.shift()
            // if (queue.isRepeating && oldSong)
            // queue.current.push(oldSong)
            
            // this._music.changeAudioState(new AudioIdle())
            this._music.player.stop(true)
            //this._music.clickPlay(message)
        }
        catch (e) {
            console.error('Can\'t skip the song')
        }
    }

    public help(): void {}
}
