import {
    CacheType,
    Message,
    MessageButton,
    MessageComponentInteraction,
    MessageEmbed,
} from 'discord.js'
import {GameButton} from '.'
import ExplodingKittenManager from '../explodingKittenManager'

export class Destroy extends GameButton {
    getCustomId(): string {
        return 'Destroy'
    }
    getComponent(): MessageButton {
        return new MessageButton()
            .setLabel(this.getCustomId())
            .setCustomId(this.getCustomId())
            .setStyle(2)
    }
    public getDestroyGameMesssage(
        interaction: MessageComponentInteraction<CacheType>
    ) {
        const {defaultAvatarURL, username} = interaction.user
        const embed = new MessageEmbed()
            .setTitle('🐱🎉 Exploding Kittens')
            .setDescription(username + ' has destroyed this game !')
            .setAuthor({
                name: username,
                iconURL: interaction.user.avatarURL() || defaultAvatarURL,
            })
        return {embeds: [embed], components: []}
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
            if (ekManager.botMessage)
                await ekManager.botMessage.edit(
                    this.getDestroyGameMesssage(interaction)
                )

            ekManager.stop()
        }
    }
}
