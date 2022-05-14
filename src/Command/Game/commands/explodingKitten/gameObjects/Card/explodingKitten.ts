import {CacheType, MessageComponentInteraction} from 'discord.js'
import {Card} from '.'
import ExplodingKittenManager from '../../explodingKittenManager'

export class ExplodingKitten extends Card {
    getEmoji(): string {
        return '💥'
    }
    async onClick(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {
        try {
            const hand = ekManager.hands.find(
                (h) => h.info.id == interaction.user.id
            )
            if (!hand) throw new Error('Invalid hand')

            const description =
                hand.info.username + ' has draw Exploding Kitten'
            ekManager.updateGeneralMessage(description, this.getImageUrl())
        } catch (e) {
            console.log(e)
        }
    }
}
