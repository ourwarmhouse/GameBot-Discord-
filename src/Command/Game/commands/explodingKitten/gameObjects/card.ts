import {inlineCode} from '@discordjs/builders'
import Canvas from 'canvas'
import {CacheType, MessageButton, MessageComponentInteraction} from 'discord.js'
import path from 'path'
import {GameButton} from '../buttons'
import ExplodingKittenManager from '../explodingKittenManager'
import {Hand} from './hand'

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
    dropCard(hand: Hand, ekManager: ExplodingKittenManager) {
        hand.removeCard(this)
        if (hand.interaction) {
            hand.interaction.editReply({
                components: ekManager.getHandButtons(hand),
            })
        }
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

export class Defuse extends Card {
    getEmoji(): string {
        return '💚'
    }
    getComponent(): MessageButton {
        return super.getComponent().setStyle(3)
    }
    async onClick(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {}
}

export class ExplodingKitten extends Card {
    getEmoji(): string {
        return '💥'
    }
    async onClick(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {
        try {
        } catch (e) {
            console.log(e)
        }
    }
}

export class SeeTheFuture extends Card {
    getEmoji(): string {
        return '👁️'
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
            const embed = ekManager.getHandEmbed(hand)
            const threeCardAboveDeck = ekManager.deck.cards
                .slice(0, 3)
                .map((c) => inlineCode(`${c.getEmoji()} ${c.getLabel()}`))
                .join('\n')
            embed.setDescription(threeCardAboveDeck)
            await interaction.editReply({
                embeds: [embed],
                components: ekManager.getHandButtons(hand),
            })
            await ekManager.botMessage.edit(
                await ekManager.getPlayingGameMessage(
                    hand.info.username +
                        ' use ' +
                        inlineCode(`${this.getEmoji()} ${this.getLabel()}`),
                    this.getImageUrl()
                )
            )
            super.dropCard(hand, ekManager)
        } catch (e) {
            console.log(e)
            interaction.reply({content: 'Please try again', ephemeral: true})
        }
    }
}

export class Shuffle extends Card {
    getEmoji(): string {
        return '🔃'
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
            const deck = ekManager.deck
            deck.shuffle()
            await ekManager.botMessage.edit(
                await ekManager.getPlayingGameMessage(
                    hand.info.username +
                        ' use ' +
                        inlineCode(`${this.getEmoji()} ${this.getLabel()}`),
                    this.getImageUrl()
                )
            )
            super.dropCard(hand, ekManager)
        } catch (e) {
            console.log(e)
            interaction.reply({content: 'Please try again', ephemeral: true})
        }
    }
}

export class Nope extends Card {
    getEmoji(): string {
        return '⛔'
    }
    async onClick(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {}
}
export class Attack extends Card {
    getEmoji(): string {
        return '⚡'
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
            let current = ekManager.getCurrentDrawCard()
            ekManager.setCurrentDrawCard(0)
            ekManager.passTurn()
            ekManager.setCurrentDrawCard(current + 1)
            ekManager.updateHandMesssage()
            if (ekManager.botMessage)
                await ekManager.botMessage.edit(
                    await ekManager.getPlayingGameMessage(
                        hand.info.username +
                            ' use ' +
                            inlineCode(this.getEmoji() + ' ' + this.getLabel())
                    )
                )
            super.dropCard(hand, ekManager)
        } catch (e) {
            console.log(e)
            interaction.reply({content: 'Please try again', ephemeral: true})
        }
    }
}

export class Skip extends Card {
    getEmoji(): string {
        return '⏩'
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
            // let current = ekManager.getCurrentDrawCard()
            // if (current > 1){
            //     current--
            // } else {

            // }
            ekManager.setCurrentDrawCard(ekManager.getCurrentDrawCard() - 1)
            ekManager.passTurn()
            if (ekManager.botMessage)
                await ekManager.botMessage.edit(
                    await ekManager.getPlayingGameMessage(
                        hand.info.username +
                            ' use ' +
                            inlineCode(this.getEmoji() + ' ' + this.getLabel())
                    )
                )
            super.dropCard(hand, ekManager)
        } catch (e) {
            console.log(e)
            interaction.reply({content: 'Please try again', ephemeral: true})
        }
    }
}

export class Favor extends Card {
    getEmoji(): string {
        return '🖤'
    }
    async onClick(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {}
}

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
