import ExplodingKittenManager from '../explodingKittenManager'
import {
    Attack,
    Card,
    Defuse,
    ExplodingKitten,
    Favor,
    Nope,
    SeeTheFuture,
    Shuffle,
    Skip,
} from './card'
import {Hand} from './hand'

export class Deck {
    private _cards: Card[]
    constructor(private _hands: Hand[]) {
        this._cards = []
        for (let i = 0; i < _hands.length + 1; ++i) {
            this._cards.push(new Defuse(i))
        }
        for (let i = 0; i < _hands.length - 1; ++i) {
            this._cards.push(new ExplodingKitten(i))
        }

        for (let i = 0; i < 5; ++i) {
            this._cards.push(new Nope(i))
            this._cards.push(new SeeTheFuture(i))
        }
        for (let i = 0; i < 4; ++i) {
            // this._cards.push(new Shuffle(i))
            // this._cards.push(new Attack(i))
            // this._cards.push(new Skip(i))
            // this._cards.push(new Favor(i))
            // this._cards.push(new PictureCard('tacocat'))
            // this._cards.push(new PictureCard('potatocat'))
            // this._cards.push(new PictureCard('meloncat'))
            // this._cards.push(new PictureCard('rainbowcat'))
        }
    }
    shuffle() {
        for (let i = this._cards.length; i > 0; --i) {
            const randomPosition = Math.floor(Math.random() * i)
            ;[this._cards[i], this._cards[randomPosition]] = [
                this._cards[randomPosition],
                this._cards[i],
            ]
        }
    }
    distributeCards() {
        //distribute defuse
        for (const hand of this._hands) {
            const card = this.cards.pop()
            if (card) hand.cards.push(card)
        }
        this.shuffle()
        //distribute random
        for (let i = 0; i < this._hands.length * 4; ++i) {
            for (const hand of this._hands) {
                //chia bai người chơi
                const card = this.cards.pop()
                if (card) hand.cards.push(card)
            }
        }
    }
    public get cards() {
        return this._cards
    }
}
