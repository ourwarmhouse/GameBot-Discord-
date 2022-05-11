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
        let count = 0

        const addCards = (
            limit: number,
            createCard: (order: number, priority: number) => Card
        ) => {
            for (let i = 0; i < limit; ++i) {
                this._cards.push(createCard(i, count))
            }
            count++
        }

        addCards(
            _hands.length + 1,
            (order, priority) => new Defuse(order, priority)
        )
        // addCards(5, (order, priority) => new Nope(order, priority))
        addCards(5, (order, priority) => new SeeTheFuture(order, priority))
        addCards(4, (order, priority) => new Shuffle(order, priority))
        addCards(4, (order, priority) => new Attack(order, priority))
        addCards(4, (order, priority) => new Skip(order, priority))
        // addCards(4, (order, priority) => new Favor(order, priority))
        // addCards(4, (order, priority) => new Melon(order, priority))
        // addCards(4, (order, priority) => new Taco(order, priority))
        // addCards(4, (order, priority) => new Rainbow(order, priority))
        // addCards(4, (order, priority) => new Potato(order, priority))

        // for (let i = 0; i < 5; ++i) {
        //     this._cards.push(new Nope(i,count))
        // }
        // for (let i = 0; i < 5; ++i) {
        //     this._cards.push(new SeeTheFuture(i,count))
        // }

        // for (let i = 0; i < 4; ++i) {
        //     this._cards.push(new Shuffle(i,count))
        //     this._cards.push(new Attack(i,count))
        //     this._cards.push(new Skip(i,count))
        //     this._cards.push(new Favor(i,count))
        //     this._cards.push(new Melon(i,count))
        //     this._cards.push(new Taco(i,count))
        //     this._cards.push(new Rainbow(i,count))
        //     this._cards.push(new Potato(i,count))
        // }
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
    // addDefuse() {
    //     for (let i = 0; i < 1; ++i) {
    //         this._cards.push(new Defuse(i + this._hands.length))
    //     }
    // }
    addExploding() {
        for (let i = 0; i < this._hands.length - 1; ++i) {
            this._cards.push(new ExplodingKitten(i, 100))
        }
    }
    insertAt(position:number,card: Card) {

        this._cards = this._cards.splice(position,0, card)
    }
    distributeCards() {
        //distribute defuse
        for (const hand of this._hands) {
            const card = this.cards.shift()
            if (card) hand.cards.push(card)
        }
        this.shuffle()
        //distribute random
        for (let i = 0; i < 4; ++i) {
            for (const hand of this._hands) {
                //chia bai người chơi
                const card = this._cards.shift()
                if (card) hand.cards.push(card)
            }
        }
        for (const hand of this._hands) {
            hand.sortCard()
        }
        // this.addDefuse()
        this.addExploding()
        this.shuffle()
    }
    public get cards() {
        return this._cards
    }
}
