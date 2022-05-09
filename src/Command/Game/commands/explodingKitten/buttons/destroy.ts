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
    public getDestroyGameMesssage(message: Message) {
        const {defaultAvatarURL, username} = message.author
        const embed = new MessageEmbed()
            .setTitle('🐱🎉 Exploding Kittens')
            .setDescription(username + ' has destroyed this game !')
            .setAuthor({
                name: username,
                iconURL: message.author.avatarURL() || defaultAvatarURL,
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
            interaction.reply({
                content: 'This game was destroyed !',
                ephemeral: true,
            })
            ekManager.gameManager.explodingKittenGames =
                ekManager.gameManager.explodingKittenGames.filter(
                    (g) => g.id != ekManager.id
                )
            if (ekManager.botMessage)
                await ekManager.botMessage.edit(
                    this.getDestroyGameMesssage(ekManager.message)
                )
            ekManager.buttonCollector.stop()
        }
    }
}
