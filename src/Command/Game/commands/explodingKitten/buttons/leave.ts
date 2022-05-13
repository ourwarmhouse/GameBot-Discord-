import {CacheType, MessageButton, MessageComponentInteraction} from 'discord.js'
import {GameButton} from '.'
import ExplodingKittenManager from '../explodingKittenManager'

export class Leave extends GameButton {
    getCustomId(): string {
        return 'Leave'
    }
    getComponent(): MessageButton {
        return new MessageButton()
            .setLabel(this.getCustomId())
            .setCustomId(this.getCustomId())
            .setStyle(2)
    }
    async onClick(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ) {
        if (interaction.customId == this.getCustomId()) {
            const userFromDiscord = interaction.user
            if (!interaction.guildId) return

            if (ekManager.master?.info.id == userFromDiscord.id) {
                interaction.reply({
                    content: "You can't out your empire !",
                    ephemeral: true,
                })
                return
            }
            if (ekManager.hands.find((h) => h.info.id == userFromDiscord.id)) {
                ekManager.leave(userFromDiscord.id)
                if (ekManager.botMessage)
                    await ekManager.botMessage.edit(
                        await ekManager.getInitGameMessage()
                    )
                interaction.deferUpdate()
                return
            } else
                interaction.reply({
                    content: "You haven't joined the game !",
                    ephemeral: true,
                })
        }
    }
}
