import {CacheType, MessageButton, MessageComponentInteraction} from 'discord.js'
import {GameButton} from '.'
import ExplodingKittenManager from '../explodingKittenManager'
import {Deck} from '../gameObjects/deck'

export class ShuffleCards extends GameButton {
    getCustomId(): string {
        return 'Shuffle Hand Cards'
    }
    getLabel(): string {
        return 'Shuffle'
    }
    getComponent(): MessageButton {
        return new MessageButton()
            .setLabel(this.getLabel())
            .setCustomId(this.getCustomId())
            .setStyle(1)
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
            Deck.shuffle(hand.cards)
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
