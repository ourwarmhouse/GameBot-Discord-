import {inlineCode} from '@discordjs/builders'
import Constant from 'Constant'
import {Message, MessageEmbed} from 'discord.js'
import MessageHandler from 'Handler/message'
import {GameCommand} from '..'
import Game from '../..'
// import {GameState, GameResult} from './state'
// import {Card, Hand, Deck} from './objects'
import currency from 'currency.js'
import ExplodingKittenManager from './ekManager'
import {Hand} from './Card'

export default class ExplodingKitten extends GameCommand {
    constructor(gameManager: Game) {
        super(gameManager)
        this._name = ' explodingKitten'
        this._alias = ' ek'
    }
    async execute(messageHandler: MessageHandler, message: Message<boolean>) {
        try {
            const newGameManager = new ExplodingKittenManager()
            if (!message.guildId) throw new Error()
            const user = await this._gameManager.userManager.findUser(
                message.author.id,
                message.guildId
            )
            if (!user) throw new Error()
            const newHand = new Hand(user, true)
            newGameManager.join(newHand)

            const introducedString =
                message.author.username + ' has started a game of UNO !'

            const userList = newGameManager.hands.map(
                (h) => `${h.isMaster ? '👑' : '👤'} ${h.info.username} \n` 
            )

            const embed = new MessageEmbed()
                .setTitle('Exploding Kitten')
                .setDescription(introducedString + '\n\n' + userList)

            this._gameManager.explodingKittenGames.push(newGameManager)
            message.channel.send({ embeds: [embed] })
            
        } catch (e) {}
    }
}
