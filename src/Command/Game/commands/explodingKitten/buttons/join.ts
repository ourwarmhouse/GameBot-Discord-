import {CacheType, MessageButton, MessageComponentInteraction} from 'discord.js'
import {GameButton} from '.'
import ExplodingKittenManager from '../explodingKittenManager'
import {Hand} from '../gameObjects/hand'

export class Join extends GameButton {
    getCustomId(): string {
        return 'Join'
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
        if (interaction.customId == this.getCustomId()) {
            const userFromDiscord = interaction.user
            if (!interaction.guildId) return

            if (ekManager.hands.find((h) => h.info.id == userFromDiscord.id)) {
                interaction.reply({
                    content:
                        "You have join this game, please don't join game you silly !",
                    ephemeral: true,
                })
                return
            }
            ekManager.join(userFromDiscord, false)
            if (ekManager.botMessage) {
                await ekManager.botMessage.edit(
                    await ekManager.getInitGameMessage()
                )
                interaction.reply({
                    content: 'You have join the game !',
                    ephemeral: true,
                })
            }
        }
    }
}
