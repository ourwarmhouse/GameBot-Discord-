import {Card} from './Card'
import {Attack} from './Card/attack'
import {Defuse} from './Card/defuse'
import {ExplodingKitten} from './Card/explodingKitten'
import {Favor} from './Card/favor'
import {Melon, Potato, Rainbow, Taco} from './Card/picture'
import {SeeTheFuture} from './Card/seeTheFuture'
import {Shuffle} from './Card/shuffle'
import {Skip} from './Card/skip'
import {Hand} from './hand'

export class Deck {
    private _cards: Card[]
    private _droppedCards: Card[]
    private _typeCards: {emoji: string; label: string}[]
    constructor(private _hands: Hand[]) {
        this._typeCards = []
        this._cards = []
        this._droppedCards = []
        let count = 0

        const addType = (emoji: string, label: string) =>
            this._typeCards.push({emoji, label})
        const addCards = (
            limit: number,
            createCard: (order: number, priority: number) => Card
        ) => {
            for (let i = 0; i < limit; ++i) {
                const card = createCard(i, count)
                if (i == 0) addType(card.getEmoji(), card.getLabel())
                this._cards.push(card)
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
        addCards(4, (order, priority) => new Favor(order, priority))
        addCards(4, (order, priority) => new Melon(order, priority))
        addCards(4, (order, priority) => new Taco(order, priority))
        addCards(4, (order, priority) => new Rainbow(order, priority))
        addCards(4, (order, priority) => new Potato(order, priority))
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
    static shuffle(cards: Card[]) {
        for (let i = cards.length - 1; i > 0; --i) {
            const randomPosition = Math.floor(Math.random() * i)
            ;[cards[i], cards[randomPosition]] = [
                cards[randomPosition],
                cards[i],
            ]
        }
    }
    pushToDroppedCards(card: Card) {
        this._droppedCards.push(card)
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
    insertAt(position: number, card: Card) {
        this._cards.splice(position, 0, card)
    }
    distributeCards() {
        //distribute defuse
        for (const hand of this._hands) {
            const card = this.cards.shift()
            if (card) hand.cards.push(card)
        }
        Deck.shuffle(this._cards)
        //distribute random
        for (let i = 0; i < 4; ++i) {
            for (const hand of this._hands) {
                //chia bai người chơi
                const card = this._cards.shift()
                if (card) hand.cards.push(card)
            }
        }
        // this.addDefuse()
        this.addExploding()
        Deck.shuffle(this._cards)
    }
    public get cards() {
        return this._cards
    }
    public get droppedCards() {
        return this._droppedCards
    }
    public get typeCard() {
        return this._typeCards
    }
}
