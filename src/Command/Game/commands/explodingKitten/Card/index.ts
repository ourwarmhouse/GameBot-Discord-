import ExplodingKittenManager from "../ekManager"
import arrayShuffle from 'array-shuffle';
import { User } from "discord.js";

export abstract class Card{
    abstract drop(): void
}

class DefuseCard extends Card{
    drop(): void {
        
    }
}

class ExplodingKitten extends Card{
    drop(): void {
        
    }
}

class SeeTheFuture extends Card{
    drop(): void {
        
    }
}

class Shuffle extends Card{
    drop(): void {
        
    }
}

class Nope extends Card{
    drop(): void {
        
    }
}

class Attack extends Card{
    drop(): void {
        
    }
}

class Skip extends Card{
    drop(): void {
        
    }
}

class Favor extends Card{
    drop(): void {
        
    }
}

type PictureType = 'bikini cat' | 'tacocat' | 'rainbow cat' | 'potato cat'    

class PictureCard extends Card{
    private _type: PictureType
    constructor(type: PictureType) {
        super()
        this._type = type
    }
    drop(): void {
        
    }
    public get type(){ return this._type}
}


export class Deck{
    private _cards: Card[]
    private _limitDefuse = 6

    constructor(gameManager: ExplodingKittenManager) {
        this._cards = []
        let i
        for(let i = 0; i < gameManager.hands.length - 1; ++i){
            this._cards.push(new ExplodingKitten())
        }
        for (let i = 0; i < this._limitDefuse - (gameManager.hands.length - 1); ++i){
            this._cards.push(new DefuseCard())
        }
        for (let i = 0; i < 5; ++i){
            this._cards.push(new Nope())
            this._cards.push(new SeeTheFuture())
        }
        for (let i = 0; i < 4; ++i){
            this._cards.push(new Shuffle())
            this._cards.push(new Attack())
            this._cards.push(new Skip())
            this._cards.push(new Favor())
            this._cards.push(new PictureCard('tacocat'))
            this._cards.push(new PictureCard('potato cat'))
            this._cards.push(new PictureCard('bikini cat'))
            this._cards.push(new PictureCard('rainbow cat'))
        }   
        this._cards = arrayShuffle(this._cards)
        
        // this.shuffle() 
    }
    public get cards(){return this._cards}
}

export class Hand {
    private _cards: Card[]
    private _deck: Deck
    private _info: User
    constructor(deck: Deck,info: User){
        this._cards = []
        this._cards.push(new DefuseCard())
        this._deck = deck
        this._info = info
    }
    public get cards(): Card[] {
        return this._cards
    }
    public get info(){return this._info}
    // public dr 
}