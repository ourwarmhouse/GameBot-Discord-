import {bold, inlineCode} from '@discordjs/builders'
import Constant from '../../../Constant'
import {Message} from 'discord.js'
import MessageHandler from 'Handler/message'
import {MusicCommand} from '.'
import Music from '..'

export default class Delete extends MusicCommand {
    constructor(_music: Music) {
        super(_music)
        this._name = this._name + ' delete'
        this._alias = this._alias + ' d'
    }

    async execute(messageHandler: MessageHandler, message: Message) {
        try {
            const args = messageHandler.commandArgs[0]
            if (args == 'all' || args == 'a') {
                if (this._music.queue.current.length == 1)
                    await message.channel.send(
                        "This song is playing, can't delete"
                    )
                else {
                    this._music.queue.clear()
                    await message.channel.send('Entire track have been purged')
                }
            } else {
                if (!Number(args)) throw new Error()
                const position = Number(args) - 1
                if (position == 0) {
                    await message.channel.send(
                        "This song is playing, can't delete"
                    )
                    throw new Error()
                }
                if (position < 0) throw new Error()
                this._music.queue.delete(position)
                await message.channel.send(
                    'Track ' + inlineCode(`[${args}]` + ' has been slayed')
                )
            }
        } catch (e) {
            message.channel.send('Please try again !')
            console.error("Can't repeat")
        }
    }

    public getHelpString(): string {
        return (
            inlineCode(Constant.prefix + this._name + " [number | 'all']") +
            ' (' +
            inlineCode(this.alias + " [number | 'a']") +
            ')'
        )
    }
}
