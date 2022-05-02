import {bold, inlineCode, time} from '@discordjs/builders'
import {Message} from 'discord.js'
import formatDuration from 'format-duration'
import MessageHandler from 'Handler/message'
import {MusicCommand} from '.'
import Music from '..'
import {TrackInQueueType} from '../queue'

export default class Queue extends MusicCommand {
    constructor(_music: Music) {
        super(_music)
        this._name = this._name + ' queue'
        this._alias = this._alias + ' q'
    }

    public getPlaylistString(playlist: TrackInQueueType[]): string {
        return `${playlist
            .map(
                (track, idx) =>
                    inlineCode(`[${idx + 1}]`) +
                    bold(track.song.title || '') +
                    ' add by ' +
                    bold(track.addBy) +
                    ' ' +
                    inlineCode(`[${track.song.durationFormatted}]`)
            )
            .join('\n')}`
    }

    async execute(messageHandler: MessageHandler, message: Message) {
        try {
            const playlist = this._music.queue.current
            const content =
                bold('Current queue:') +
                '\n\n' +
                this.getPlaylistString(playlist) +
                '\n\n' +
                'There are ' +
                bold(playlist.length.toString()) +
                ' with total ' +
                bold(
                    `[${formatDuration(
                        playlist.reduce((acc, ele) => acc + ele.song.duration, 0)
                    )}]`
                ) +
                ' in queue'
            message.channel.send(content)
        }catch(e){
            console.log('Can\'t get the queue')
        }
    }

    public help(): void {}
}
