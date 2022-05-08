import {Card, Deck, Hand} from './Card'
import {uid} from 'uid'

export default class ExplodingKittenManager {
    public id: string
    public hands: Hand[]
    public deck!: Deck
    // public state: State
    constructor() {
        this.id = uid()
        this.hands = []
    }
    join(hand: Hand) {
        this.hands.push(hand)
    }
    start() {
        this.deck = new Deck(this)
        for (let i = 0; i < this.hands.length * 4; ++i) {
            for (const hand of this.hands) {
                //chia bài người chơi
                const card = this.deck.cards.pop() as Card
                hand.cards.push(card)
            }
        }
    }
    leave(hand: Hand) {
        this.hands = this.hands.filter((h) => h.info.id != hand.info.id)
    }
}
