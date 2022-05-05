import {bold, inlineCode} from '@discordjs/builders'
import Constant from '../../../Constant'
import {Message} from 'discord.js'
import MessageHandler from 'Handler/message'
import {Video, YouTube} from 'youtube-sr'
import {MusicCommand} from '.'
import Music from '..'

export default class Play extends MusicCommand {
    private _limitSearch = 5
    constructor(_music: Music) {
        super(_music)
        this._name = this._name + ' play'
        this._alias = this._alias + ' p'
        this._price = 1000
    }
    private getAuthorName(message: Message) {
        return (
            message.member?.nickname || message.author.username || 'anonymous'
        )
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

            const isPayed = await this.payForThisCommand(
                message,
                message.author.id,
                this._price
            )
            if (!isPayed) return false

            const menuContent =
                `Track ` +
                bold(result.title || '') +
                inlineCode(`[${result.durationFormatted}]`) +
                ' add by ' +
                bold(this.getAuthorName(message))
            message.channel.send(menuContent)
            this.music.queue.push(this.getAuthorName(message), result)
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
                inlineCode(this.getAuthorName(message)) +
                `\n` +
                this.getPlaylistString(videos)
            message.channel.send(menuContent)

            //get stream and play song
            videos.forEach((v) =>
                this.music.queue.push(this.getAuthorName(message), v)
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
                this.getPlaylistString(results) +
                bold('\nType ') +
                inlineCode('c') +
                bold(' to cancel')
            const chosenFromBot = await message.channel.send(menuContent)

            //let user chose a song
            const collector = message.channel.createMessageCollector({
                filter: (msg) => msg.author.id === message.author.id,
                max: 1,
                time: 50000,
            })
            collector.on('collect', async (msg) => {
                //validate the number which user chosed
                if (msg.content == 'c') {
                    await chosenFromBot.delete()
                    await msg.delete()
                    await message.channel.send('No track choose by user')
                    return
                }

                const chooseNumber = Number(msg.content)
                if (
                    isNaN(chooseNumber) ||
                    chooseNumber < 1 ||
                    chooseNumber > this.limitSearch
                ) {
                    await message.channel.send('Not an option or a number!')
                    return
                }

                const isPayed = await this.payForThisCommand(
                    message,
                    message.author.id,
                    this._price
                )
                if (!isPayed) return

                const result = results[chooseNumber - 1]

                const chosedContent =
                    `Track ` +
                    inlineCode(`[${chooseNumber}]`) +
                    ` has been chosen by ` +
                    bold(this.getAuthorName(message)) +
                    '\n' +
                    result.title +
                    ' ' +
                    inlineCode(`[${result.durationFormatted}]`)

                await chosenFromBot.delete()
                await msg.delete()
                await message.channel.send(chosedContent)

                //get stream and play song
                this.music.queue.push(this.getAuthorName(message), result)
                this.music.clickPlay(message)
            })
            return true
        } catch (e) {
            return false
        }
    }
    async execute(messageHandler: MessageHandler, message: Message) {
        try {
            if (!messageHandler.commandArgs[0]) {
                this._music.clickConnect(message)
                return
            }

            const args = messageHandler.commandArgs.join(' ')

            if (Constant.linkRegex.test(args)) {
                const isPlayAPlaylist = await this.searchForPlaylistAndPlay(
                    message,
                    args
                )
                if (!isPlayAPlaylist) {
                    await this.searchForSpecificSong(message, args)
                }
            } else {
                await this.searchForListSongAndChose(message, args)
            }
        } catch (e) {
            message.channel.send('Please try again !')
            console.log(e)
        }
    }

    public getHelpString(): string {
        return (
            inlineCode(Constant.prefix + this._name + ' [search | url]') +
            ' (' +
            inlineCode(this.alias + ' [search | url]') +
            ')'
        )
    }

    public get limitSearch() {
        return this._limitSearch
    }
}
