import {CacheType, MessageButton, MessageComponentInteraction} from 'discord.js'
import {GameButton} from '.'
import ExplodingKittenManager from '../explodingKittenManager'

export class SortCards extends GameButton {
    getCustomId(): string {
        return 'Sort'
    }
    getComponent(): MessageButton {
        return new MessageButton()
            .setLabel(this.getCustomId())
            .setCustomId(this.getCustomId())
            .setStyle(3)
    }

    async onClick(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ) {
        try {
            if (interaction.customId != this.getCustomId()) return
            const hand = ekManager.hands.find(
                (h) => h.info.id == interaction.user.id
            )
            if (!hand) throw new Error('Invalid hand')
            hand.sortCard()
            if (hand.interaction) {
                hand.interaction.editReply({
                    components: ekManager.getHandButtons(hand),
                })
            }
            await interaction.deferUpdate()
            hand.interaction = interaction
        } catch (e) {
            console.log(e)
        }
    }
}
