import {
    CacheType,
    Message,
    MessageActionRow,
    MessageButton,
    MessageComponentInteraction,
    MessageEmbed,
} from 'discord.js'
import {GameButton} from '.'
import ExplodingKittenManager from '../explodingKittenManager'

export class DrawCards extends GameButton {
    getCustomId(): string {
        return 'Draw'
    }
    getComponent(): MessageButton {
        return new MessageButton()
            .setLabel(this.getCustomId())
            .setCustomId(this.getCustomId())
            .setStyle(4)
    }

    async onClick(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ) {
        try {
            const hand = ekManager.hands.find(
                (h) => h.info.id == interaction.user.id
            )
            if (!hand) throw new Error('Invalid hand')
            const card = ekManager.deck.cards.shift()
            if (!card) throw new Error('Empty deck')
            console.log(card)
            hand.cards.push(card)
            ekManager.passTurn()
        } catch (e) {
            console.log(e)
        }
    }
}
