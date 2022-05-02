import {bold, inlineCode} from '@discordjs/builders'
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

    public getPlaylistString(playlist: Video[]) {
        return `${playlist
            .map(
                (track, idx) =>
                    inlineCode(`[${idx + 1}]`) +
                    track.title +
                    ' ' +
                    inlineCode(`[${track.durationFormatted}]`)
            )
            .join('\n')}`
    }
    async execute(messageHandler: MessageHandler, message: Message) {
        try {
            //search for song list
            const results = await YouTube.search(
                messageHandler.commandArgs.join(' '),
                {limit: this._limitSearch, type: 'video'}
            )

            //display song list
            const menuContent =
                `${
                    bold('Chose a track by ') +
                    inlineCode(`1-${this._limitSearch}`) +
                    bold(' command:')
                }\n` + this.getPlaylistString(results)
            message.channel.send(menuContent)

            //let user chose a song
            const collector = message.channel.createMessageCollector({
                filter: (msg) => msg.author.id === message.author.id,
                max: 1,
                time: 15000,
            })
            collector.on('collect', async (msg) => {
                //validate the number which user chosed
                const chooseNumber = Number(msg.content)
                if (
                    isNaN(chooseNumber) ||
                    chooseNumber < 1 ||
                    chooseNumber > this._limitSearch
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
                this._music.queue.push(
                    message.member?.nickname || 'anonymous',
                    result
                )
                this._music.clickPlay(message)
            })
        } catch (e) {
            console.log(e)
        }
    }

    public help(): void {}
}
