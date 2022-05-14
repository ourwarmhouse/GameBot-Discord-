import {inlineCode} from '@discordjs/builders'
import {CacheType, MessageComponentInteraction} from 'discord.js'
import {Card} from '.'
import ExplodingKittenManager from '../../explodingKittenManager'
import {Deck} from '../deck'

export class Shuffle extends Card {
    getEmoji(): string {
        return '🔃'
    }
    async onClick(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {
        try {
            const hand = ekManager.hands.find(
                (h) => h.info.id == interaction.user.id
            )
            if (!hand) throw new Error()
            const deck = ekManager.deck
            Deck.shuffle(deck.cards)
            ekManager.dropCard(hand, [this])
            const description =
                hand.info.username +
                ' use ' +
                inlineCode(`${this.getEmoji()} ${this.getLabel()}`) +
                ' and shuffle the deck'
            ekManager.updateGeneralMessage(description, this.getImageUrl())
            await interaction.deferUpdate()
            hand.interaction = interaction
        } catch (e) {
            console.log(e)
            interaction.reply({content: 'Please try again', ephemeral: true})
        }
    }
}
