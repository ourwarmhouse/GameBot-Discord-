import {CacheType, MessageComponentInteraction, User} from 'discord.js'
import ExplodingKittenManager from '../explodingKittenManager'
import {Card} from './Card'

export class Hand {
    private _cards: Card[]
    private _info: User
    private _isMaster: boolean
    public interaction!: MessageComponentInteraction<CacheType>
    constructor(info: User, isMaster: boolean) {
        this._cards = []
        this._info = info
        this._isMaster = isMaster
    }
    public onClickCards(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ) {
        for (const card of this.cards) {
            if (card.getCustomId() == interaction.customId)
                card.onClick(ekManager, interaction)
        }
    }

    public removeCard(card: Card) {
        this._cards = this.cards.filter((c) => c !== card)
    }

    sortCard() {
        this._cards.sort((a, b) => a.getPriority() - b.getPriority())
    }

    public get cards(): Card[] {
        return this._cards
    }

    public get info() {
        return this._info
    }

    public get isMaster() {
        return this._isMaster
    }
    // public dr
}
