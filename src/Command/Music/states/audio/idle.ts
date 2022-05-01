import {createAudioResource} from '@discordjs/voice'
import ytdl from 'ytdl-core'
import State from '.'
import Playing from './playing'

export default class Idle extends State {
    public play(): void {
        const queue = this._music.queue.current
        if (!(queue.length > 0)) return
        const stream = ytdl(`https://youtube.com?v=${queue[0].song.id}`, {
            filter: 'audioonly',
        })

        const resource = createAudioResource(stream)
        this._music.player.play(resource)
        this._music.changeAudioState(new Playing())
    }
}
