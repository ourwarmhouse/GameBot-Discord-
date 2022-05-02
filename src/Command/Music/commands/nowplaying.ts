import {bold, time, hyperlink, inlineCode} from '@discordjs/builders'
import {Message, MessageEmbed} from 'discord.js'
import formatDuration from 'format-duration'
import MessageHandler from 'Handler/message'
import {MusicCommand} from '.'
import Music from '..'
import thounsandFormat from 'aveta'

export default class NowPlaying extends MusicCommand {
    constructor(_music: Music) {
        super(_music)
        this._name = this._name + ' nowplaying'
        this._alias = this._alias + ' np'
    }

    async execute(messageHandler: MessageHandler, message: Message) {
        try {
            const {song, addBy} = this._music.queue.current[0]
            if (!song) return
            const content = new MessageEmbed().setColor(`LUMINOUS_VIVID_PINK`)
            if (
                song.channel &&
                song.channel.name &&
                song.channel.url &&
                song.title && song.thumbnail?.url &&
                song.channel.icon.url
            ) {
                const songChannelString = hyperlink(
                    song.channel.name,
                    song.channel.url
                )
                const songString = hyperlink(song.title, song.url)
                content.addField('Channel', songChannelString)
                    .setDescription(songString)
                    .setImage(song.thumbnail.url)
                    .setThumbnail(song.channel.icon.url)
            }
            if (this._music.currentResource) {
                content.addField(
                    'Time',
                    inlineCode(
                        `[${formatDuration(
                            this._music.currentResource.playbackDuration
                        )}/${formatDuration(song.duration)}]`
                    )
                )
                    
            }
            if (song.uploadedAt)
                content.addField('Release', song.uploadedAt)
            content.addField('View',thounsandFormat(song.views))
            if (song.description)
                content.addField('Description', song.description.slice(0,20) + '\n' + 'Add by '+ addBy)
            
            message.reply({embeds: [content]})
        } catch (e) {
            console.error("Can't get playing song")
        }
    }

    public help(): void {}
}
