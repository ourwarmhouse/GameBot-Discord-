import {
    CacheType,
    MessageButton,
    MessageComponentInteraction,
    MessageSelectMenu,
} from 'discord.js'
import ExplodingKittenManager from '../explodingKittenManager'

export abstract class GameSelect {
    abstract getCustomId(): string
    abstract getComponent(): MessageSelectMenu
    abstract onSelect(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void>
}
