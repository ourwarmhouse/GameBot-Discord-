import MessageHandler from 'Handler/message'
import {IUser} from 'Database'
import {Message} from 'discord.js'
import {GameState} from './gameObjects/state'
import {Deck} from './gameObjects/deck'
import {inlineCode} from '@discordjs/builders'
import currency from 'currency.js'

export default class BlackJackManager {
    private _gameState: GameState
    private _botMessage!: Message
    public removeUserCallBack!: () => void
    public overGameCallBack!: () => Promise<void>
    constructor(
        private _messageHandler: MessageHandler,
        private _message: Message<boolean>,
        private _betNumber: number,
        private _user: IUser
    ) {
        this._gameState = new GameState(
            _message,
            _betNumber,
            new Deck(_messageHandler)
        )
    }
    public async startGameMessage() {
        this._botMessage = await this._message.reply(
            this.gameState.getMessage()
        )
    }
    public setRemoveUserCallBack(removeUser: () => void) {
        this.removeUserCallBack = removeUser
    }
    public setOverGameCallBack(overGame: () => Promise<void>) {
        this.overGameCallBack = overGame
    }
    public collectButton() {
        const buttonCollector =
            this._message.channel.createMessageComponentCollector({
                filter: (msg) => msg.user.id === this._message.author.id,
                time: this.gameState.overTime,
            })

        buttonCollector
            .on('collect', async (interaction) => {
                if (interaction.customId === 'hit') this.gameState.hit()
                if (interaction.customId === 'stand') this.gameState.stand()
                interaction.update(this.gameState.getMessage())
                if (this.gameState.isOver()) {
                    await this.overGameCallBack()
                    buttonCollector.stop()
                }
            })
            .on('end', async () => {
                if (this.gameState.isOver()) {
                    this.removeUserCallBack()
                    return
                }
                if (this._botMessage) {
                    this._botMessage.edit({
                        content:
                            'Your time is up ! ' +
                            inlineCode(
                                '-' + currency(this._betNumber).format()
                            ),
                        embeds: [],
                        components: [],
                    })
                }
                this.removeUserCallBack()
            })
    }
    public get user() {
        return this._user
    }
    public get gameState() {
        return this._gameState
    }
}
