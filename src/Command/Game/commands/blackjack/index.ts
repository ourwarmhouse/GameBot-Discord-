import {inlineCode} from '@discordjs/builders'
import Constant from '../../../../Constant'
import {Message} from 'discord.js'
import MessageHandler from 'Handler/message'
import {GameCommand} from '..'
import Game from '../..'
import {GameState, GameResult} from './state'
import {Card, Hand, Deck} from './objects'
import currency from 'currency.js'

export default class BlackJack extends GameCommand {
    constructor(gameManager: Game) {
        super(gameManager)
        this._name = 'blackjack'
        this._alias = 'bj'
    }
    async execute(messageHandler: MessageHandler, message: Message<boolean>) {
        try {
            let bet = messageHandler.commandArgs[0]
            let betNumber: number

            const guildId = message.guildId
            if (!guildId) {
                message.reply('Please join a server to execute this command')
                return
            }

            if (bet == 'all' || bet == 'a' || bet == 'al') {
                betNumber = await this._gameManager.userManager.getBalance(
                    message.author,
                    guildId
                )
            } else if (isNaN(Number(bet)) || Number(bet) > 0) {
                betNumber = Number(bet)
            } else {
                message.reply('Please give your bet !')
                return
            }

            const gameState = new GameState(message, betNumber, new Deck())

            const botMessage = await message.reply(gameState.getMessage())

            const buttonCollector =
                message.channel.createMessageComponentCollector({
                    filter: (msg) => msg.user.id === message.author.id,
                    time: 15000,
                })

            buttonCollector
                .on('collect', async (interaction) => {
                    if (interaction.customId === 'hit') gameState.hit()
                    if (interaction.customId === 'stand') gameState.stand()
                    interaction.update(gameState.getMessage())
                    if (gameState.isOver()) {
                        const {result} = gameState
                        if (
                            result == GameResult.BlackJack ||
                            result == GameResult.Won
                        )
                            await this._gameManager.userManager.updateBalance(
                                message.author.id,
                                guildId,
                                betNumber
                            )
                        else if (
                            result == GameResult.Lost ||
                            result == GameResult.TimeUp
                        )
                            await this._gameManager.userManager.updateBalance(
                                message.author.id,
                                guildId,
                                -betNumber
                            )

                        buttonCollector.stop()
                    }
                })
                .on('end', async () => {
                    if (gameState.isOver()) return
                    botMessage.edit({
                        content:
                            'Your time is up ! ' +
                            inlineCode('-' + currency(betNumber).format()),
                        embeds: [],
                        components: [],
                    })
                    await this._gameManager.userManager.updateBalance(
                        message.author.id,
                        guildId,
                        -betNumber
                    )
                })
        } catch (e) {}
    }

    public getHelpString(): string {
        return (
            inlineCode(
                Constant.prefix + this._name + " [number | 'all' | 'a']"
            ) +
            ' (' +
            inlineCode(this.alias + " [number | 'all' | 'a']") +
            ')'
        )
    }
}
