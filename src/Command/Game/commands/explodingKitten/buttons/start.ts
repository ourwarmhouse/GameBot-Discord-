import {CacheType, MessageButton, MessageComponentInteraction} from 'discord.js'
import {GameButton} from '.'
import ExplodingKittenManager from '../explodingKittenManager'

export class Start extends GameButton {
    getCustomId(): string {
        return 'Start'
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

            if (ekManager.master.info.id != userFromDiscord.id) {
                interaction.reply({
                    content: 'You have no permission to start game !',
                    ephemeral: true,
                })
                return
            }
            if (interaction.channel) {
                await interaction.channel.send('Start !')
                ekManager.start()
                // await ekManager.botMessage.edit(await this.getStartGameMessage(ekManager))
            }
        }
    }
}
