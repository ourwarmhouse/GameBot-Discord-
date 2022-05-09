import ExplodingKittenManager from '../explodingKittenManager'
import {Deck} from './deck'

export class State {
    private _deck: Deck
    private _turnNumber: number = 0

    constructor(private _ekManager: ExplodingKittenManager) {
        this._deck = new Deck(_ekManager.hands)
        this._deck.distributeCards()
    }
}

export class Waiting extends State {

}

export class Playing extends State {

}

export class Giving extends State {

}

export class DrawingInvalid extends State {
    
}

export class DrawingValid extends State {

}
