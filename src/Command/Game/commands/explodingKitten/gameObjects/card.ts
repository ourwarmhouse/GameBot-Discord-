import Canvas from 'canvas'
import {MessageComponentInteraction, CacheType, MessageButton} from 'discord.js'
import path from 'path'
import {GameButton} from '../buttons'
import explodingKittenManager from '../explodingKittenManager'

export abstract class Card extends GameButton {
    protected _order!: number
    async getCanvasImage() {
        return await Canvas.loadImage(
            path.join(
                __dirname,
                `../assets/${this.constructor.name}/${this._order}.png`
            )
        )
    }
}

export class Defuse extends Card {
    constructor(order: number) {
        super()
        this._order = order
    }
    getCustomId(): string {
        return this.constructor.name + this._order
    }
    getComponent(): MessageButton {
        return new MessageButton()
            .setCustomId(this.getCustomId())
            .setEmoji('💚')
            .setLabel(this.getCustomId())
            .setStyle(3)
    }
    async onClick(
        ekManager: explodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {}
}

export class ExplodingKitten extends Card {
    constructor(order: number) {
        super()
        this._order = order
    }
    getCustomId(): string {
        return this.constructor.name + this._order
    }
    getComponent(): MessageButton {
        return new MessageButton()
            .setCustomId(this.getCustomId())
            .setEmoji('🐱‍👓')
            .setLabel(this.getCustomId())
            .setStyle(2)
    }
    async onClick(
        ekManager: explodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {}
}

export class SeeTheFuture extends Card {
    constructor(order: number) {
        super()
        this._order = order
    }
    getCustomId(): string {
        return this.constructor.name + this._order
    }
    getComponent(): MessageButton {
        return new MessageButton()
            .setCustomId(this.getCustomId())
            .setEmoji('👁️')
            .setLabel(this.getCustomId())
            .setStyle(2)
    }
    async onClick(
        ekManager: explodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {
        ekManager.botMessage
        interaction.reply
    }
}

export class Shuffle extends Card {
    constructor(order: number) {
        super()
        this._order = order
    }
    getCustomId(): string {
        return this.constructor.name + this._order
    }
    getComponent(): MessageButton {
        return new MessageButton()
            .setCustomId(this.getCustomId())
            .setEmoji('🔃')
            .setLabel(this.getCustomId())
            .setStyle(2)
    }
    async onClick(
        ekManager: explodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {}
}

export class Nope extends Card {
    constructor(order: number) {
        super()
        this._order = order
    }
    getCustomId(): string {
        return this.constructor.name + this._order
    }
    getComponent(): MessageButton {
        return new MessageButton()
            .setCustomId(this.getCustomId())
            .setEmoji('⛔')
            .setLabel(this.getCustomId())
            .setStyle(2)
    }
    async onClick(
        ekManager: explodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {}
}
export class Attack extends Card {
    constructor(order: number) {
        super()
        this._order = order
    }
    getCustomId(): string {
        return this.constructor.name + this._order
    }
    getComponent(): MessageButton {
        return new MessageButton()
            .setCustomId(this.getCustomId())
            .setEmoji('⚡')
            .setLabel(this.getCustomId())
            .setStyle(2)
    }
    async onClick(
        ekManager: explodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {}
}

export class Skip extends Card {
    constructor(order: number) {
        super()
        this._order = order
    }
    getCustomId(): string {
        return this.constructor.name + this._order
    }
    getComponent(): MessageButton {
        return new MessageButton()
            .setCustomId(this.getCustomId())
            .setEmoji('⏩')
            .setLabel(this.getCustomId())
            .setStyle(2)
    }
    async onClick(
        ekManager: explodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {}
}

export class Favor extends Card {
    constructor(order: number) {
        super()
        this._order = order
    }
    getCustomId(): string {
        return this.constructor.name + this._order
    }
    getComponent(): MessageButton {
        return new MessageButton()
            .setCustomId(this.getCustomId())
            .setEmoji('🖤')
            .setLabel(this.getCustomId())
            .setStyle(2)
    }
    async onClick(
        ekManager: explodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {}
}

// abstract class Cat extends Card{

// }

// class Melon extends Cat{

// }
// class Taco extends Cat{

// }
// class Rainbow extends Cat{

// }
// class Potato extends Cat{

// }
