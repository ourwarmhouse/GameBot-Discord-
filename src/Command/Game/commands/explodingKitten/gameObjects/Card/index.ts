import Canvas from 'canvas'
import {MessageButton} from 'discord.js'
import path from 'path'
import {GameButton} from '../../buttons'

export abstract class Card extends GameButton {
    protected _order!: number
    protected _priority!: number
    constructor(order: number, priority: number) {
        super()
        this._order = order
        this._priority = priority
    }
    async getCanvasImage() {
        return await Canvas.loadImage(
            path.join(
                __dirname,
                `../assets/${this.constructor.name}/${this._order}.png`
            )
        )
    }

    getPriority() {
        return this._priority
    }
    getImageUrl() {
        return `https://raw.githubusercontent.com/nnaaaa/DisneyLand/main/src/Command/Game/commands/explodingKitten/assets/${this.constructor.name}/${this._order}.png`
    }
    getComponent(): MessageButton {
        return new MessageButton()
            .setCustomId(this.getCustomId())
            .setLabel(this.getLabel())
            .setEmoji(this.getEmoji())
            .setStyle(2)
    }
    getCustomId(): string {
        return this.constructor.name + this._order
    }
    getLabel(): string {
        const customId = this.getCustomId()
        return customId.slice(0, customId.length - 1)
    }
    abstract getEmoji(): string
}
