import {bold, inlineCode} from '@discordjs/builders'
import Constant from '../../../Constant'
import {Message} from 'discord.js'
import MessageHandler from 'Handler/message'
import {Video, YouTube} from 'youtube-sr'
import {MusicCommand} from '.'
import Music from '..'

export default class Play extends MusicCommand {
    private _limitSearch = 7
    constructor(_music: Music) {
        super(_music)
        this._name = this._name + ' play'
        this._alias = this._alias + ' p'
    }

    private getPlaylistString(playlist: Video[]) {
        return `${playlist
            .slice(0, this._limitSearch)
            .map(
                (track, idx) =>
                    inlineCode(`[${idx + 1}]`) +
                    track.title +
                    ' ' +
                    inlineCode(`[${track.durationFormatted}]`)
            )
            .join('\n')}`
    }
    private searchForSpecificSong = async (
        message: Message,
        searchText: string
    ) => {
        try {
            let result = await YouTube.getVideo(searchText)
            if (!result) throw new Error()
            const menuContent =
                `Track ` +
                bold(result.title || '') +
                inlineCode(`[${result.durationFormatted}]`) +
                ' add by ' +
                bold(message.member?.nickname || 'anonymous')
            message.channel.send(menuContent)
            this.music.queue.push(
                message.member?.nickname || 'anonymous',
                result
            )
            this.music.clickPlay(message)
            return true
        } catch (e) {
            return false
        }
    }

    private searchForPlaylistAndPlay = async (
        message: Message,
        searchText: string
    ) => {
        try {
            let {videos, videoCount} = await YouTube.getPlaylist(searchText)
            const menuContent =
                bold(`Total `) +
                inlineCode(videoCount.toString()) +
                bold(` added to queue by`) +
                inlineCode(message.member?.nickname || 'anonymous') +
                `\n` +
                this.getPlaylistString(videos)
            message.channel.send(menuContent)

            //get stream and play song
            videos.forEach((v) =>
                this.music.queue.push(
                    message.member?.nickname || 'anonymous',
                    v
                )
            )
            this.music.clickPlay(message)
            return true
        } catch (e) {
            return false
        }
    }

    private searchForListSongAndChose = async (
        message: Message,
        searchText: string
    ) => {
        try {
            const results = await YouTube.search(searchText, {
                limit: this.limitSearch,
                type: 'video',
            })

            //display song list
            const menuContent =
                bold('Chose a track by ') +
                inlineCode(`1-${this.limitSearch}`) +
                bold(' command:') +
                `\n` +
                this.getPlaylistString(results)
            message.channel.send(menuContent)

            //let user chose a song
            const collector = message.channel.createMessageCollector({
                filter: (msg) => msg.author.id === message.author.id,
                max: 1,
                time: 15000,
            })
            collector
                .on('collect', async (msg) => {
                    //validate the number which user chosed
                    const chooseNumber = Number(msg.content)
                    if (
                        isNaN(chooseNumber) ||
                        chooseNumber < 1 ||
                        chooseNumber > this.limitSearch
                    ) {
                        message.channel.send('Not an option or a number!')
                        return
                    }
                    const result = results[chooseNumber - 1]

                    //edit content when song was chosen

                    const chosedContent =
                        `Track ` +
                        inlineCode(`[${chooseNumber}]`) +
                        ` has been chosen by ` +
                        bold(msg.member?.nickname || 'anonymous') +
                        '\n' +
                        result.title +
                        ' ' +
                        inlineCode(`[${result.durationFormatted}]`)
                    if (msg.editable) {
                        await msg.edit(chosedContent)
                    } else if (msg.deletable) {
                        await msg.delete()
                        message.channel.send(chosedContent)
                    } else {
                        throw new Error("Can't reply user's choosing")
                    }

                    //get stream and play song
                    this.music.queue.push(
                        message.member?.nickname || 'anonymous',
                        result
                    )
                    this.music.clickPlay(message)
                })
                .on('end', (col) => console.log(col))
            return true
        } catch (e) {
            return false
        }
    }
    async execute(messageHandler: MessageHandler, message: Message) {
        try {
            const args = messageHandler.commandArgs[0]

            if (Constant.linkRegex.test(args)) {
                const isPlayAPlaylist = await this.searchForPlaylistAndPlay(
                    message,
                    args
                )
                if (!isPlayAPlaylist) {
                    this.searchForSpecificSong(message, args)
                }
            } else {
                this.searchForListSongAndChose(message, args)
            }
        } catch (e) {
            message.channel.send('Please try again !')
            console.log(e)
        }
    }
    public get limitSearch() {
        return this._limitSearch
    }
}
