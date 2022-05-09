import {Client} from 'discord.js'

export interface Suit {
    name: string
    label: string
}

export interface Rank {
    label: string
    value: number
}

export class Card {
    private _suit: Suit
    private _rank: Rank
    private _isHidden: boolean
    private _isAce: boolean
    private _client: Client

    constructor(suit: Suit, rank: Rank, client: Client, isHidden: boolean) {
        this._suit = suit
        this._rank = rank
        this._isHidden = isHidden
        this._isAce = this._rank.label == '1' ? true : false
        this._client = client
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
        const alias = this._isHidden
            ? 'lockcard'
            : this._suit.name + this._rank.label
        const emoji = this._client.emojis.cache.find((e) => e.name == alias)
        if (!emoji) return ' '

        return emoji.toString()
    }

    public static readonly Rank: Rank[] = [
        {label: '1', value: 11}, // this will be adjusted later
        {label: '2', value: 2},
        {label: '3', value: 3},
        {label: '4', value: 4},
        {label: '5', value: 5},
        {label: '6', value: 6},
        {label: '7', value: 7},
        {label: '8', value: 8},
        {label: '9', value: 9},
        {label: '10', value: 10},
        {label: '11', value: 10},
        {label: '12', value: 10},
        {label: '13', value: 10},
    ]

    public static readonly Suit: Suit[] = [
        {name: 's', label: '♠'},
        {name: 'h', label: '♥'},
        {name: 'c', label: '♣'},
        {name: 'd', label: '♦'},
    ]
}
