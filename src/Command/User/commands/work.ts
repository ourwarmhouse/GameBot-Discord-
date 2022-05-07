import { inlineCode } from '@discordjs/builders'
import currency from 'currency.js'
import { Message } from 'discord.js'
import formatDuration from 'format-duration'
import message from 'Handler/message'
import { UserCommand } from '.'
import User from '..'
import Constant from '../../../Constant'

export default class Work extends UserCommand {
    private _amount = 1000
    private _limitTime = Constant.MINUTE * 3
    constructor(userManager: User) {
        super(userManager)
        this._name = this._name + ' work'
        this._alias = this._alias + ' w'
    }
    createQuestion(): {question: string; answer: string} {
        let x = Math.floor(Math.random() * 20 + 1)
        let y = Math.floor(Math.random() * x + 1)
        const operatorList = ['+', '-', 'x']
        const operatorRandom = Math.floor(Math.random() * operatorList.length)
        const question = `Answer the question: ${x} ${operatorList[operatorRandom]} ${y} = ?`
        let answer
        switch (operatorRandom) {
            case 0:
                answer = x + y
                break
            case 1:
                answer = x - y
                break
            case 2:
                x = Math.floor(Math.random() * 30 + 1)
                y = Math.floor(Math.random() * x + 1)
                answer = x * y
                break
            default:
                answer = x + y
                break
        }
        return {question, answer: answer.toString()}
    }

    async execute(messageHandler: message, message: Message<boolean>) {
        try {
            this._amount = Math.round(Math.random() * 1000)
            if (!message.guildId) throw new Error()
            const user = await this._userManager.getOrCreateUser(
                message.author,
                message.guildId
            )

            if (!user) throw new Error()
            const duration = new Date().getTime() - user.lastWork.getTime()
            if (duration < this._limitTime) {
                message.reply(
                    'You must relax ' +
                        inlineCode(formatDuration(this._limitTime - duration)) +
                        ' before working'
                )
                return
            }

            const {question, answer} = this.createQuestion()
            await message.reply(question)
            const collector = message.channel.createMessageCollector({
                filter: (msg) => msg.author.id === message.author.id,
                max: 1,
                time: 50000,
            })
            collector
                .on('collect', async (msg) => {
                    if (!message.guildId) throw new Error()
                    if (msg.content == answer) {
                        const isReceived =
                            await this._userManager.updateBalance(
                                message.author.id,
                                message.guildId,
                                this._amount
                            )
                        if (!isReceived) throw new Error()
                        await this._userManager.updateUser(
                            message.author.id,
                            message.guildId,
                            {
                                lastWork: new Date(),
                            }
                        )
                        message.reply(
                            'You are a hard worker. This ' +
                                inlineCode(currency(this._amount).format()) +
                                ' is your wage'
                        )
                    } else {
                        await this._userManager.updateUser(
                            message.author.id,
                            message.guildId,
                            {
                                lastWork: new Date(),
                            }
                        )
                        message.reply(
                            "Your answer isn't correct. Try after " +
                                inlineCode(formatDuration(this._limitTime))
                        )
                    }
                })
                .on('end', (collected) => {})
        } catch (e) {
            message.reply('Please try again !')
        }
    }
}
