import {inlineCode} from '@discordjs/builders'
import {
    CacheType,
    MessageActionRow,
    MessageButton,
    MessageComponentInteraction,
} from 'discord.js'
import {Card} from '.'
import ExplodingKittenManager from '../../explodingKittenManager'
import {Deck} from '../deck'

export class Shuffle extends Card {
    getEmoji(): string {
        return '🔃'
    }
    static getCustomSecondClickId() {
        return 'Shuffle Second Click'
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

            ekManager.dropCard(hand, [this])
            const description =
                hand.info.username +
                ' use ' +
                inlineCode(`${this.getEmoji()} ${this.getLabel()}`) +
                ' and shuffle the deck'
            await ekManager.updateGeneralMessage(
                description,
                this.getImageUrl()
            )
            const embed = ekManager.getHandEmbed(hand)
            const row = new MessageActionRow()
            const theSecondClick = new MessageButton()
                .setLabel('Click here to shuffle the deck')
                .setStyle(3)
                .setCustomId(Shuffle.getCustomSecondClickId())
            row.addComponents(theSecondClick)
            if (hand.interaction) {
                await hand.interaction.editReply({
                    embeds: [embed],
                    components: [row],
                })
            }
            ekManager.updateHistory(hand, [this])
            await interaction.deferUpdate()
            hand.interaction = interaction
        } catch (e) {
            console.log(e)
            interaction.reply({content: 'Please try again', ephemeral: true})
        }
    }
    static async onSecondClick(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {
        try {
            if (interaction.customId !== Shuffle.getCustomSecondClickId())
                return
            const hand = ekManager.hands.find(
                (h) => h.info.id == interaction.user.id
            )
            if (!hand || !ekManager.deck) throw new Error()

            Deck.shuffle(ekManager.deck.cards)
            if (hand.interaction) {
                await hand.interaction.editReply(
                    ekManager.getHandMessage(hand, 'The deck is shuffled')
                )
            }
            await interaction.deferUpdate()
            hand.interaction = interaction
        } catch (e) {
            console.log(e)
            interaction.reply({content: 'Please try again', ephemeral: true})
        }
    }
}
