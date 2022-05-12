import Canvas from 'canvas'
import {CacheType, MessageButton, MessageComponentInteraction} from 'discord.js'
import path from 'path'
import {Card} from '.'
import ExplodingKittenManager from '../../explodingKittenManager'

abstract class Cat extends Card {
    async getCanvasImage() {
        return await Canvas.loadImage(
            path.join(__dirname, `../assets/Cats/${this.constructor.name}.png`)
        )
    }
    getImageUrl() {
        return `https://raw.githubusercontent.com/nnaaaa/DisneyLand/main/src/Command/Game/commands/explodingKitten/assets/Cats/${this.constructor.name}.png`
    }
    getComponent(): MessageButton {
        return super.getComponent().setStyle(1)
    }
    async onClick(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {}
}

export class Melon extends Cat {
    getEmoji(): string {
        return '🍉'
    }
}
export class Taco extends Cat {
    getEmoji(): string {
        return '🥟'
    }
}
export class Rainbow extends Cat {
    getEmoji(): string {
        return '🌈'
    }
}
export class Potato extends Cat {
    getEmoji(): string {
        return '🥔'
    }
}
