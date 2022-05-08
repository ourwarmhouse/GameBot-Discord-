import {inlineCode} from '@discordjs/builders'
import Constant from '../../../../Constant'
import {Message} from 'discord.js'
import MessageHandler from 'Handler/message'
import {GameCommand} from '..'
import Game from '../..'
import {GameState, GameResult} from './state'
import {Card, Hand, Deck} from './objects'
import currency from 'currency.js'
import BlackJackManager from './blackjackManager'

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
            if (!message.guildId) throw new Error()
            const user = await this._gameManager.userManager.findUser(
                message.author.id,
                message.guildId
            )
            if (!user) throw new Error()
            
            const guildId = message.guildId
            if (!guildId) {
                message.reply('Please join a server to execute this command')
                throw new Error()
            }

            if (this._gameManager.blackJackGames.find(g => g.user.id == user.id)) {
                message.reply('Complete the game which you have join before start a new game !')
                throw new Error()
            }

            //check bet argument
            if (
                (bet == 'all' || bet == 'a' || bet == 'al') &&
                user.balance > 0
            ) {
                betNumber = await this._gameManager.userManager.getBalance(
                    message.author,
                    guildId
                )
            } else if (
                (isNaN(Number(bet)) || Number(bet) > 0) &&
                Number(bet) <= user.balance
            ) {
                betNumber = Number(bet)
            } else {
                message.reply('Please give your valid bet !')
                throw new Error()
            }

            this._gameManager.blackJackGames.push(new BlackJackManager(user))
            await this._gameManager.userManager.updateBalance(
                message.author.id,
                guildId,
                -betNumber
            )
            const gameState = new GameState(
                message,
                betNumber,
                new Deck(messageHandler)
            )

            const botMessage = await message.reply(gameState.getMessage())

            const buttonCollector =
                message.channel.createMessageComponentCollector({
                    filter: (msg) => msg.user.id === message.author.id,
                    time: gameState.overTime,
                })

            buttonCollector
                .on('collect', async (interaction) => {
                    if (interaction.customId === 'hit') gameState.hit()
                    if (interaction.customId === 'stand') gameState.stand()
                    interaction.update(gameState.getMessage())
                    if (gameState.isOver()) {
                        const {result} = gameState
                        if (result == GameResult.Won)
                            await this._gameManager.userManager.updateBalance(
                                message.author.id,
                                guildId,
                                betNumber * 2
                            )
                        if (result == GameResult.Tie)
                            await this._gameManager.userManager.updateBalance(
                                message.author.id,
                                guildId,
                                betNumber
                            )
                        this._gameManager.blackJackGames = this._gameManager.blackJackGames.filter(
                            (b) => b.user.id != user.id
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
                    this._gameManager.blackJackGames =
                        this._gameManager.blackJackGames.filter(
                            (b) => b.user.id != user.id
                        )
                })
        } catch (e) {
        }
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
