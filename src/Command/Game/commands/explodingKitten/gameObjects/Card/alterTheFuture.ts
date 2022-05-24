import { inlineCode } from '@discordjs/builders'
import {
    CacheType,
    MessageComponentInteraction,
    MessageActionRow,
    MessageButton,
} from 'discord.js'
import { Card } from '.'
import ExplodingKittenManager from '../../explodingKittenManager'
import { SeeTheFuture } from './seeTheFuture'

export class AlterTheFuture extends SeeTheFuture {
    private _cardsInTheFuture: Card[]
    private _cardButtons: MessageButton[]
    constructor(order: number, priority: number) {
        super(order, priority)
        this._cardsInTheFuture = []
        this._cardButtons = []
    }
    getEmoji(): string {
        return '🧙‍♀️'
    }

    getCustomTertiaryClickId() {
        return 'Alter The Future Tertiary Click' + this._order
    }
    getCurrentSelectClickCardId(order: number) {
        return 'Alter Arrange Card ' + this._order + ' ' + order
    }

    override async onSecondClick(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {
        try {
            if (interaction.customId !== this.getCustomSecondClickId())
                return
            console.log("check")
            const hand = ekManager.hands.find(
                (h) => h.info.id == interaction.user.id
            )
            if (!hand || !ekManager.deck) throw new Error()

            const embed = ekManager.getHandEmbed(hand)

            this._cardsInTheFuture = ekManager.deck.cards.slice(0, 3)
            const cardAboveDeck = this._cardsInTheFuture
                .map((c) => inlineCode(`${c.getEmoji()} ${c.getLabel()}`))
                .join('\n')
            embed.setDescription(cardAboveDeck + '\n\n' + 'Chose the position for current card')


            const row = new MessageActionRow()
            for (let i = 0; i < this._cardsInTheFuture.length; ++i) {
                const orderButton = new MessageButton()
                    .setLabel(i.toString())
                    .setStyle(2)
                    .setCustomId(this.getCurrentSelectClickCardId(i))
                this._cardButtons.push(orderButton)
                row.addComponents(orderButton)
            }
            if (hand.interaction) {
                await hand.interaction.editReply({ embeds: [embed], components: [row] })
            }
            // await interaction.deferUpdate()
            // hand.interaction = interaction
        } catch (e) {
            console.log(e)
            // interact`ion.reply({ content: 'Please try again', ephemeral: true })
        }
    }

    async onTertiaryClick(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {
        try {
            const hand = ekManager.hands.find(
                (h) => h.info.id == interaction.user.id
            )
            if (!hand) throw new Error()
            let isThisButton = false
            for (let i = 0; i < this._cardsInTheFuture.length; ++i) {
                if (this._cardButtons[i] && interaction.customId[interaction.customId.length - 1] == this._cardButtons[i].label) {
                    isThisButton = true

                    let tempCard = this._cardsInTheFuture[0]
                    this._cardsInTheFuture[0] = this._cardsInTheFuture[i]
                    this._cardsInTheFuture[i] = tempCard

                    const embed = ekManager.getHandEmbed(hand)

                    const cardAboveDeck = this._cardsInTheFuture
                        .map((c) => inlineCode(`${c.getEmoji()} ${c.getLabel()}`))
                        .join('\n')
                    embed.setDescription(cardAboveDeck)

                    this._cardButtons = this._cardButtons.filter((b) => b.label !== i.toString())

                    if (this._cardButtons.length == 1) {
                        ekManager.deck.cards = ekManager.deck.cards.slice(this.numOfAboveCard)
                        ekManager.deck.cards = this._cardsInTheFuture.concat(ekManager.deck.cards)
                        this._cardsInTheFuture = []
                        embed.setDescription(cardAboveDeck + '\n\n' + 'Arranged successfully')
                        if (hand.interaction) {
                            await hand.interaction.editReply({ embeds: [embed], components: ekManager.getHandButtons(hand) })
                        }
                    }
                    else {
                        const row = new MessageActionRow()
                        for (const btn of this._cardButtons)
                            row.addComponents(btn)

                        if (hand.interaction) {
                            await hand.interaction.editReply({ embeds: [embed], components: [row] })
                        }
                    }
                }
            }
            if (isThisButton) {
                if (this._cardsInTheFuture.length !== 0 && this._cardButtons.length === 0) {

                }
                await interaction.deferUpdate()
                hand.interaction = interaction
            }
        } catch (e) {
            console.log(e)
            // interaction.reply({ content: 'Please try again', ephemeral: true })
        }
    }



}
