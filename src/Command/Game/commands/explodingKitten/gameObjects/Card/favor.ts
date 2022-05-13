import { inlineCode } from '@discordjs/builders'
import {
    CacheType,
    MessageActionRow,
    MessageComponentInteraction,
    MessageSelectMenu
} from 'discord.js'
import { Card } from '.'
import ExplodingKittenManager from '../../explodingKittenManager'
import { FavorSelect } from '../../selects/favorSelect'

export class Favor extends Card {
    getEmoji(): string {
        return '🖤'
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

            const embed = ekManager.getHandEmbed(
                hand,
                'Choose the player who you want to take the card'
            )
            const handsExcepteMe = ekManager.hands.filter(
                (h) => h.info.id !== hand.info.id
            )
            const memberMenu = new MessageSelectMenu()
                .setCustomId(FavorSelect.getCustomMemberSelectId())
                .setPlaceholder('Select one player')

            for (const h of handsExcepteMe)
                memberMenu.addOptions({
                    value: h.info.id,
                    label: h.info.username,
                })

            if (hand.interaction) {
                hand.interaction.editReply({
                    embeds: [embed],
                    components: [
                        new MessageActionRow().addComponents(memberMenu),
                    ],
                })
            }
            super.dropCard(hand, ekManager, interaction, false)
            if (ekManager.botMessage)
                await ekManager.botMessage.edit(
                    await ekManager.getPlayingGameMessage(
                        hand.info.username +
                            ' use ' +
                            inlineCode(
                                this.getEmoji() + ' ' + this.getLabel()
                            ) +
                            ' and selecting a player to steal one card',
                        this.getImageUrl()
                    )
                )
        } catch (e) {
            console.log(e)
            interaction.reply({content: 'Please try again', ephemeral: true})
        }
    }
}
