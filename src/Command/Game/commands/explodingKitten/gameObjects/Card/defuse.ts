import {inlineCode} from '@discordjs/builders'
import {CacheType, MessageButton, MessageComponentInteraction} from 'discord.js'
import {Card} from '.'
import ExplodingKittenManager from '../../explodingKittenManager'

export class Defuse extends Card {
    getEmoji(): string {
        return '💚'
    }
    getComponent(): MessageButton {
        return super.getComponent().setStyle(3)
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

            ekManager.dropCard(hand, [this])
            ekManager.passTurn()
            const description =
                hand.info.username +
                ' use ' +
                inlineCode(this.getEmoji() + ' ' + this.getLabel()) +
                ' and safe after the exploding'
            ekManager.updateGeneralMessage(description, this.getImageUrl())

            await interaction.deferUpdate()
            hand.interaction = interaction
        } catch (e) {
            console.log(e)
        }
    }
}
