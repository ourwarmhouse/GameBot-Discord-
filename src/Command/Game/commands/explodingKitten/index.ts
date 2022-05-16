import {Message} from 'discord.js'
import MessageHandler from 'Handler/message'
import {GameCommand} from '..'
import Game from '../..'
// import {GameState, GameResult} from './state'
// import {Card, Hand, Deck} from './objects'
import ExplodingKittenManager from './explodingKittenManager'

export default class ExplodingKitten extends GameCommand {
    constructor(gameManager: Game) {
        super(gameManager)
        this._name = 'explodingKitten'
        this._alias = 'ek'
    }
    async execute(messageHandler: MessageHandler, message: Message<boolean>) {
        try {
            if (!message.channelId) throw new Error()

            if (this._gameManager.explodingKittenGames.find(g=>g.channelId == message.channelId))
                throw new Error()
            
            const gameManager = new ExplodingKittenManager(
                messageHandler,
                message,
                this._gameManager,
                0,
                message.channelId
            )

            if (!message.guildId) throw new Error()
            const user = await this._gameManager.userManager.findUser(
                message.author.id,
                message.guildId
            )
            if (!user) throw new Error()

            gameManager.join(message.author, true)

            await gameManager.initGameMessage()
            this._gameManager.explodingKittenGames.push(gameManager)
        } catch (e) {
            message.reply('Please try again !')
        }
    }
}
