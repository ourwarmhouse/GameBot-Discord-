import {Message, User} from 'discord.js'
import {Card, Defuse} from './card'
import {Deck} from './deck'

export class Hand {
    private _cards: Card[]
    private _deck!: Deck
    private _info: User
    private _isMaster: boolean
    public message!: Message
    constructor(info: User, isMaster: boolean) {
        this._cards = []
        this._info = info
        this._isMaster = isMaster
    }

    public get cards(): Card[] {
        return this._cards
    }

    public get info() {
        return this._info
    }

    public setDeck(deck: Deck) {
        this._deck = deck
    }

    public get isMaster() {
        return this._isMaster
    }
    // public dr
}
