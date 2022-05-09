import {CacheType, MessageButton, MessageComponentInteraction} from 'discord.js'
import ExplodingKittenManager from '../explodingKittenManager'

export abstract class GameButton {
    abstract getCustomId(): string
    abstract getComponent(): MessageButton
    abstract onClick(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void>
}
