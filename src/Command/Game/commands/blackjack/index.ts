import { inlineCode } from '@discordjs/builders'
import Constant from '../../../../Constant'
import {Message} from 'discord.js'
import MessageHandler from 'Handler/message'
import {GameCommand} from '..'
import Game from '../..'
import {Card, GameState, Hand, GameResult, Deck} from './state'

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

            const gameState = new GameState(
                message,
                betNumber,
                new Deck()
            )

            let botMessage = await message.channel.send(gameState.getMessage())

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

                    // remove game from games list
                    if (gameState.isOver()) {
                        const {result} = gameState
                        if (
                            result == GameResult.BlackJack ||
                            result == GameResult.Won
                        )
                            await this._gameManager.userManager.updateBalance(
                                message.author,
                                guildId,
                                betNumber
                            )
                        else if (
                            result == GameResult.Lost ||
                            result == GameResult.TimeUp
                        )
                            await this._gameManager.userManager.updateBalance(
                                message.author,
                                guildId,
                                -betNumber
                            )

                        buttonCollector.stop()
                    }
                })
                .on('end', () => {
                })
        } catch (e) {}
    }

    public getHelpString(): string {
        return (
            inlineCode(Constant.prefix + this._name + " [number | 'all' | 'a']") +
            ' (' +
            inlineCode(this.alias + " [number | 'all' | 'a']") +
            ')'
        )
    }
}
