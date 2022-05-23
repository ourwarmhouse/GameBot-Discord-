import {inlineCode} from '@discordjs/builders'
import {
    CacheType,
    MessageComponentInteraction,
    MessageActionRow,
    MessageButton,
} from 'discord.js'
import {Card} from '.'
import {DrawCards} from '../../buttons/drawCard'
import ExplodingKittenManager from '../../explodingKittenManager'

export class BocDit extends Card {

    getEmoji(): string {
        return '🍑'
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
            
        } catch (e) {
            console.log(e)
            interaction.reply({content: 'Please try again', ephemeral: true})
        }
    }
}