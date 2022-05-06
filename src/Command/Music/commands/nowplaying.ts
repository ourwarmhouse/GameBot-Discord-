import {hyperlink, inlineCode} from '@discordjs/builders'
import thounsandFormat from 'aveta'
import {Message, MessageEmbed} from 'discord.js'
import formatDuration from 'format-duration'
import MessageHandler from 'Handler/message'
import {MusicCommand} from '.'
import Music from '..'

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
            console.log(song)
            const content = new MessageEmbed().setColor(`LUMINOUS_VIVID_PINK`)
            if (
                song.channel &&
                song.channel.name &&
                song.channel.url &&
                song.title &&
                song.thumbnail?.url &&
                song.channel.icon.url
            ) {
                const {name, url, icon} = song.channel
                content
                    // .addField('Channel', songChannelString)
                    .setAuthor({name, url, iconURL: icon.url})
                    .setTitle(song.title)
                    .setURL(song.url)
                    .setImage(song.thumbnail.url)
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
            if (song.uploadedAt) content.addField('Release', song.uploadedAt)
            content.addField('View', thounsandFormat(song.views))
            if (song.description)
                content.addField(
                    'Description',
                    song.description.slice(0, 20) + '\n' + 'Add by ' + addBy
                )

            message.reply({embeds: [content]})
        } catch (e) {
            message.channel.send('Please try again !')
            console.error("Can't get playing song")
        }
    }
}
