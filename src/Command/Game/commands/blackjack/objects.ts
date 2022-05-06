import {MessageButton, MessageEmbed} from 'discord.js'

export interface Suit {
    name: string
    label: string
}

export interface Rank {
    label: string
    value: number
}

export interface CustomMessageOptions {
    embed: MessageEmbed
    buttons: MessageButton[]
}

// export enum Gif {
//     win = "https://media.giphy.com/media/J5Ye3xSZk4CfAL12dX/giphy.gif",
//     lose = "https://media.giphy.com/media/Y4z9olnoVl5QI/giphy.gif",
//     tie = "https://media.giphy.com/media/xT3i0P4CYQcdmFZQkM/giphy.gif",
//     blackjack = "https://media.giphy.com/media/cjPFESwD0lu7M9tCO2/giphy.gif",
//     timeup = "https://media.giphy.com/media/gLjD6hjRaLcFslzpvR/giphy.gif"
// }

export class Card {
    private _suit: Suit
    private _rank: Rank
    private _isHidden: boolean
    private _isAce: boolean

    constructor(suit: Suit, rank: Rank, isHidden: boolean) {
        this._suit = suit
        this._rank = rank
        this._isHidden = isHidden
        this._isAce = this._rank.label == 'A' ? true : false
    }

    public get suit(): Suit {
        return this._suit
    }

    public get rank(): Rank {
        return this._rank
    }

    public get isHidden(): boolean {
        return this._isHidden
    }
    public set isHidden(h: boolean) {
        this._isHidden = h
    }

    public get isAce(): boolean {
        return this._isAce
    }

    public print(): string {
        let x: string = ''
        if (!this._isHidden) {
            x += '**' + this._rank.label + '** '
            x += this._suit.label
        } else x += '🔒'
        return x
    }

    public static readonly Rank: Rank[] = [
        {label: 'A', value: 11}, // this will be adjusted later
        {label: '2', value: 2},
        {label: '3', value: 3},
        {label: '4', value: 4},
        {label: '5', value: 5},
        {label: '6', value: 6},
        {label: '7', value: 7},
        {label: '8', value: 8},
        {label: '9', value: 9},
        {label: '10', value: 10},
        {label: 'J', value: 10},
        {label: 'Q', value: 10},
        {label: 'K', value: 10},
    ]

    public static readonly Suit: Suit[] = [
        {name: 'Spade', label: '♠'},
        {name: 'Heart', label: '♥'},
        {name: 'Club', label: '♣'},
        {name: 'Diamond', label: '♦'},
    ]
}

export class Deck {
    private _cards: Card[] = []
    constructor() {
        for (let r in Card.Rank) {
            for (let s in Card.Suit) {
                const rank = Card.Rank[r] // value between 0 -> 12
                const suit = Card.Suit[s] // value between 0 -> 3
                this._cards.push(new Card(suit, rank, false))
            }
        }
        this.shuffle()
    }
    public shuffle() {
        for (let i = this._cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[this._cards[i], this._cards[j]] = [this._cards[j], this._cards[i]]
        }
    }
    public draw(isHidden = false) {
        const card = this._cards.shift() as Card

        card.isHidden = isHidden
        return card
    }
}

export class Hand {
    private _cards: Card[]

    constructor(_card0: Card, _card1: Card) {
        this._cards = [_card0, _card1]
    }

    public get cards(): Card[] {
        return this._cards
    }

    public getValue(): number {
        let total: number = 0
        let aceStack: Card[] = []

        this._cards.map((card) => {
            if (card.isAce) aceStack.push(card)
            total += card.rank.value
        })

        if (total > 21) {
            // this is for dynamically changing the value of Ace Card
            for (let i in aceStack) {
                total -= 10
                if (total <= 21) return total
            }
        }
        return total
    }

    public print(): string {
        let doShowValue: boolean = true // if false, the value of hand won't be displayed
        let x: string = this._cards[0].print()

        for (var i = 1; i < this.cards.length; i++) {
            x += ' - '
            x += this.cards[i].print()

            if (this.cards[i].isHidden) doShowValue = false
        }
        if (doShowValue) x += ' (' + this.getValue() + ')'
        else x += ' (xx)'
        return x
    }
}
