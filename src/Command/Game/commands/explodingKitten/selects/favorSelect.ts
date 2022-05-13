import {bold} from '@discordjs/builders'
import {
    CacheType,
    MessageActionRow,
    MessageComponentInteraction,
    MessageSelectMenu,
} from 'discord.js'
import {GameSelect} from '.'
import ExplodingKittenManager from '../explodingKittenManager'
import {Card} from '../gameObjects/Card'
import {Hand} from '../gameObjects/hand'

export class FavorSelect {
    public owner!: Hand
    public selectedHand!: Hand
    public selectedCard!: Card

    static getCustomMemberSelectId(): string {
        return 'Favor Select Member'
    }
    static getCustomCardsSelectId(): string {
        return 'Favor Select Cards'
    }
    async onSelect(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {
        try {
            if (
                interaction.customId == FavorSelect.getCustomMemberSelectId() &&
                interaction.isSelectMenu()
            ) {
                const from = ekManager.hands.find(
                    (h) => h.info.id == interaction.values[0]
                )
                const to = ekManager.hands.find(
                    (h) => h.info.id == interaction.user.id
                )
                if (!from || !to) return
                this.owner = to
                this.selectedHand = from
                if (ekManager.botMessage)
                    await ekManager.botMessage.edit(
                        await ekManager.getPlayingGameMessage(
                            to.info.username +
                                ' will steal a card from ' +
                                from.info.username +
                                '\n' +
                                from.info.username +
                                ' is selecting card for ' +
                                to.info.username
                        )
                    )
                if (from.interaction) {
                    const cardsMenu = new MessageSelectMenu()
                        .setCustomId(FavorSelect.getCustomCardsSelectId())
                        .setPlaceholder('Select one card')
                    for (const card of from.cards)
                        cardsMenu.addOptions({
                            label: card.getEmoji() + ' ' + card.getLabel(),
                            value: card.getCustomId(),
                        })
                    const embed = ekManager.getHandEmbed(
                        from,
                        'Select one card for ' + bold(this.owner.info.username)
                    )
                    from.interaction.editReply({
                        embeds: [embed],
                        components: [
                            new MessageActionRow().addComponents(cardsMenu),
                        ],
                    })
                }
                if (to.interaction) {
                    await to.interaction.editReply({
                        embeds: [
                            ekManager.getHandEmbed(
                                to,
                                `Wait for ${bold(
                                    from.info.username
                                )} select one card for you`
                            ),
                        ],
                    })
                }
                interaction.deferUpdate()
            } else if (
                interaction.customId == FavorSelect.getCustomCardsSelectId() &&
                interaction.isSelectMenu()
            ) {
                if (!this.selectedHand) return
                const card = this.selectedHand.cards.find(
                    (c) => c.getCustomId() == interaction.values[0]
                )
                if (!card) return
                // from
                this.selectedHand.removeCard(card)
                // to
                this.owner.cards.push(card)
                ekManager.updateHandMesssage()

                ekManager.passTurn()

                if (ekManager.botMessage)
                    await ekManager.botMessage.edit(
                        await ekManager.getPlayingGameMessage(
                            bold(this.owner.info.username) +
                                ' has stolen a card from ' +
                                bold(this.selectedHand.info.username)
                        )
                    )
                interaction.deferUpdate()
            }
        } catch (e) {}
    }
}
