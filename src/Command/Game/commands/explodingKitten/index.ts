import {inlineCode} from '@discordjs/builders'
import Constant from '../../../../Constant'
import {Message} from 'discord.js'
import MessageHandler from 'Handler/message'
import {GameCommand} from '..'
import Game from '../..'
// import {GameState, GameResult} from './state'
// import {Card, Hand, Deck} from './objects'
import currency from 'currency.js'

export default class ExplodingKitten extends GameCommand {
    constructor(gameManager: Game) {
        super(gameManager)
        this._name = ' explodingKitten'
        this._alias = ' ek'
    }
    async execute(messageHandler: MessageHandler, message: Message<boolean>) {
        try {
            
        }
        catch (e) {
            
        }
    }

}
    