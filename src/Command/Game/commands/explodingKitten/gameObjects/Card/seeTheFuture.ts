import {inlineCode} from '@discordjs/builders'
import {
    CacheType,
    MessageComponentInteraction,
    MessageActionRow,
    MessageButton,
} from 'discord.js'
import {Card} from '.'
import ExplodingKittenManager from '../../explodingKittenManager'

export class SeeTheFuture extends Card {
    getEmoji(): string {
        return '👁️'
    }
    static getCustomSecondClickId() {
        return 'See The Future Second Click'
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
            ekManager.dropCard(hand, [this], false)
            const description =
                hand.info.username +
                ' use ' +
                inlineCode(`${this.getEmoji()} ${this.getLabel()}`)
            ekManager.updateGeneralMessage(description, this.getImageUrl())
            const embed = ekManager.getHandEmbed(hand)
            const row = new MessageActionRow()
            const theSecondClick = new MessageButton()
                .setLabel('Click here to see the future')
                .setStyle(3)
                .setCustomId(SeeTheFuture.getCustomSecondClickId())
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
            if (interaction.customId !== SeeTheFuture.getCustomSecondClickId())
                return
            const hand = ekManager.hands.find(
                (h) => h.info.id == interaction.user.id
            )
            if (!hand || !ekManager.deck) throw new Error()

            const embed = ekManager.getHandEmbed(hand)
            const threeCardAboveDeck = ekManager.deck.cards
                .slice(0, 3)
                .map((c) => inlineCode(`${c.getEmoji()} ${c.getLabel()}`))
                .join('\n')
            embed.setDescription(threeCardAboveDeck)
            if (hand.interaction) {
                await hand.interaction.editReply(
                    ekManager.getHandMessage(hand, threeCardAboveDeck)
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
