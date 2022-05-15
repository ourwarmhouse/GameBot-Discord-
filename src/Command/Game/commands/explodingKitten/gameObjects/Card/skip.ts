import {inlineCode} from '@discordjs/builders'
import {CacheType, MessageComponentInteraction} from 'discord.js'
import {Card} from '.'
import ExplodingKittenManager from '../../explodingKittenManager'

export class Skip extends Card {
    getEmoji(): string {
        return '⏩'
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
            ekManager.updateHistory(hand, [this])
            ekManager.setCurrentDrawCard(ekManager.currentDrawCard - 1)
            ekManager.passTurn()
            if (hand.interaction) {
                hand.interaction.editReply({
                    embeds: [ekManager.getHandEmbed(hand)],
                })
            }

            const description =
                hand.info.username +
                ' use ' +
                inlineCode(this.getEmoji() + ' ' + this.getLabel())
            await ekManager.updateGeneralMessage(
                description,
                this.getImageUrl()
            )
            await interaction.deferUpdate()
            hand.interaction = interaction
        } catch (e) {
            console.log(e)
            interaction.reply({content: 'Please try again', ephemeral: true})
        }
    }
}
