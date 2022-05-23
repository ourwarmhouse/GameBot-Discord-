import {inlineCode} from '@discordjs/builders'
import {
    CacheType,
    MessageComponentInteraction,
    MessageActionRow,
    MessageButton,
} from 'discord.js'
import {Card} from '.'
import ExplodingKittenManager from '../../explodingKittenManager'

export class SeeTheFuture extends Card {
    private _numOfAboveCard:number
    constructor(order:number,priority:number) {
        super(order, priority)
        this._numOfAboveCard = 3
    }
    set numOfAboveCard(num:number) {
        this._numOfAboveCard = num
    }
    getEmoji(): string {
        return '👁️'
    }
    getCustomSecondClickId() {
        return 'See The Future Second Click'
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
            ekManager.dropCard(hand, [this], false)
            const description =
                hand.info.username +
                ' use ' +
                inlineCode(`${this.getEmoji()} ${this.getLabel()}`)
            ekManager.updateGeneralMessage(description, this.getImageUrl())
            const embed = ekManager.getHandEmbed(hand)
            const row = new MessageActionRow()
            const theSecondClick = new MessageButton()
                .setLabel('Click here to see the future')
                .setStyle(this._numOfAboveCard)
                .setCustomId(this.getCustomSecondClickId())
            row.addComponents(theSecondClick)
            if (hand.interaction) {
                await hand.interaction.editReply({
                    embeds: [embed],
                    components: [row],
                })
            }
            ekManager.updateHistory(hand, [this])
            await interaction.deferUpdate()
            hand.interaction = interaction
        } catch (e) {
            console.log(e)
            interaction.reply({content: 'Please try again', ephemeral: true})
        }
    }

    async onSecondClick(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {
        try {
            if (interaction.customId !== this.getCustomSecondClickId())
                return
            const hand = ekManager.hands.find(
                (h) => h.info.id == interaction.user.id
            )
            if (!hand || !ekManager.deck) throw new Error()

            const cardAboveDeck = ekManager.deck.cards
                .slice(0, this._numOfAboveCard)
                .map((c) => inlineCode(`${c.getEmoji()} ${c.getLabel()}`))
                .join('\n')
            if (hand.interaction) {
                await hand.interaction.editReply(
                    ekManager.getHandMessage(hand, cardAboveDeck)
                )
            }
            await interaction.deferUpdate()
            hand.interaction = interaction
        } catch (e) {
            console.log(e)
            interaction.reply({content: 'Please try again', ephemeral: true})
        }
    }
}
