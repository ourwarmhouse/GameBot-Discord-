import ExplodingKittenManager from '../explodingKittenManager'
import {
    Attack,
    Card,
    Defuse,
    ExplodingKitten,
    Favor,
    Melon,
    Nope,
    Potato,
    Rainbow,
    SeeTheFuture,
    Shuffle,
    Skip,
    Taco,
} from './card'
import {Hand} from './hand'

export class Deck {
    private _cards: Card[]
    constructor(private _hands: Hand[]) {
        this._cards = []
        for (let i = 0; i < _hands.length; ++i) {
            this._cards.push(new Defuse(i))
        }

        for (let i = 0; i < 5; ++i) {
            this._cards.push(new Nope(i))
            this._cards.push(new SeeTheFuture(i))
        }
        for (let i = 0; i < 4; ++i) {
            this._cards.push(new Shuffle(i))
            this._cards.push(new Attack(i))
            this._cards.push(new Skip(i))
            this._cards.push(new Favor(i))
            this._cards.push(new Melon(i))
            this._cards.push(new Taco(i))
            this._cards.push(new Rainbow(i))
            this._cards.push(new Potato(i))
        }
    }
    shuffle() {
        for (let i = this._cards.length - 1; i > 0; --i) {
            const randomPosition = Math.floor(Math.random() * i)
            ;[this._cards[i], this._cards[randomPosition]] = [
                this._cards[randomPosition],
                this._cards[i],
            ]
        }
    }
    addDefuse() {
        for (let i = 0; i < 1; ++i) {
            this._cards.push(new Defuse(i + this._hands.length))
        }
    }
    addExploding() {
        for (let i = 0; i < this._hands.length - 1; ++i) {
            this._cards.push(new ExplodingKitten(i))
        }
    }
    distributeCards() {
        //distribute defuse
        for (const hand of this._hands) {
            const card = this.cards.shift()
            if (card) hand.cards.push(card)
        }
        this.shuffle()
        //distribute random
        for (let i = 0; i < this._hands.length * 12; ++i) {
            for (const hand of this._hands) {
                //chia bai người chơi
                const card = this._cards.shift()
                if (card) hand.cards.push(card)
            }
        }
        this.addDefuse()
        this.addExploding()
        this.shuffle()
    }
    public get cards() {
        return this._cards
    }
}
