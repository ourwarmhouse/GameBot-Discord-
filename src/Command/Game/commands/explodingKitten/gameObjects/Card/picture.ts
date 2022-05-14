import Canvas from 'canvas'
import {
    CacheType,
    MessageActionRow,
    MessageButton,
    MessageComponentInteraction,
    MessageSelectMenu,
} from 'discord.js'
import path from 'path'
import {Card} from '.'
import {Back} from '../../buttons/back'
import ExplodingKittenManager from '../../explodingKittenManager'
import {PictureSelect} from '../../selects/pictureSelect'

export abstract class Cat extends Card {
    async getCanvasImage() {
        return await Canvas.loadImage(
            path.join(__dirname, `../assets/Cats/${this.constructor.name}.png`)
        )
    }
    static isCat(card: Card) {
        return (
            card.constructor.name == Melon.name ||
            card.constructor.name == Taco.name ||
            card.constructor.name == Rainbow.name ||
            card.constructor.name == Potato.name
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
    ): Promise<void> {
        try {
            const hand = ekManager.hands.find(
                (h) => h.info.id == interaction.user.id
            )
            if (!hand) throw new Error()
            const numOfSameTypeCard = hand.cards.filter(
                (c) => c.getLabel() == this.getLabel()
            )
            const numOfCatCard = hand.cards.filter((c) => Cat.isCat(c))
            if (numOfSameTypeCard.length > 1 || numOfCatCard.length == 5) {
                const embed = ekManager.getHandEmbed(
                    hand,
                    'Choose the combo card'
                )
                const comboMenu = new MessageSelectMenu()
                    .setCustomId(PictureSelect.getCustomSelectComboId())
                    .setPlaceholder('Select one combo')
                const backButton = new Back().getComponent()
                if (numOfSameTypeCard.length >= 2)
                    comboMenu.addOptions({
                        value: 'two card ' + this.getLabel(),
                        label: '🌈🌈 Two same type cards',
                        description:
                            'steal one card of one player (select random card)',
                    })
                if (numOfSameTypeCard.length >= 3)
                    comboMenu.addOptions({
                        value: 'three card ' + this.getLabel(),
                        label: '🌮🌮🌮 Three same type cards',
                        description:
                            'steal one card of one player (select card which you want)',
                    })
                if (numOfCatCard.length >= 5) {
                    comboMenu.addOptions({
                        value: 'five card ' + this.getLabel(),
                        label: 'Five cat cards',
                        description:
                            'select one card in the dropped cards',
                    })
                }

                if (hand.interaction) {
                    hand.interaction.editReply({
                        embeds: [embed],
                        components: [
                            new MessageActionRow().addComponents(comboMenu),
                            new MessageActionRow().addComponents(backButton),
                        ],
                    })
                }
                interaction.deferUpdate()
            } else {
            }
        } catch (e) {}
    }
}

export class Melon extends Cat {
    getEmoji(): string {
        return '🍉'
    }
}
export class Taco extends Cat {
    getEmoji(): string {
        return '🌮'
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
