import { bold, inlineCode } from '@discordjs/builders'
import { CacheType, MessageActionRow, MessageComponentInteraction, MessageSelectMenu } from 'discord.js'
import ExplodingKittenManager from '../explodingKittenManager'
import { Card } from '../gameObjects/Card'
import { Hand } from '../gameObjects/hand'

export class PictureSelect {
    public owner!: Hand
    public selectedHand!: Hand
    public selectedCard!: Card

    static getCustomSelectComboId(): string {
        return 'Picture Select Combo Cards'
    }
    static getCustomSelectMemberId(): string {
        return 'Picture Select Member'
    }
    static getCustomTwoCardSelectCardId(): string {
        return 'Picture Two Card Select Card'
    }

    async onSelect(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {
        try {
            if (!interaction.isSelectMenu()) return
            if (interaction.customId == PictureSelect.getCustomSelectComboId()) {
                const hand = ekManager.hands.find(
                    (h) => h.info.id == interaction.user.id
                )
                if (!hand) throw new Error()
                const combo = interaction.values[0].split(' ').slice(0, 2).join(' ')
                const cardLabel = interaction.values[0].split(' ').slice(2, 3)[0]
                if (combo == 'two card') {
                    const twoCard = hand.cards.filter(c => c.getLabel() == cardLabel).slice(0, 2)
                    const representCard = twoCard[0]
                    if (twoCard.length < 2) throw new Error()

                    if (ekManager.botMessage)
                        await ekManager.botMessage.edit(
                            await ekManager.getPlayingGameMessage(
                                hand.info.username +
                                ' use 2 card ' +
                                inlineCode(
                                    representCard.getEmoji() + ' ' + representCard.getLabel()
                                ) +
                                ' and selecting a player to steal one card',
                                representCard.getImageUrl()
                            )
                        )

                    const embed = ekManager.getHandEmbed(
                        hand,
                        'Choose the player who you want to take the card'
                    )
                    const handsExcepteMe = ekManager.hands.filter(
                        (h) => h.info.id !== hand.info.id
                    )
                    const memberMenu = new MessageSelectMenu()
                        .setCustomId(PictureSelect.getCustomSelectMemberId())
                        .setPlaceholder('Select one player')

                    for (const h of handsExcepteMe)
                        memberMenu.addOptions({
                            value: h.info.id,
                            label: h.info.username,
                        })

                    if (hand.interaction) {
                        hand.interaction.editReply({
                            embeds: [embed],
                            components: [
                                new MessageActionRow().addComponents(memberMenu),
                            ],
                        })
                    }
                    representCard.dropCards(hand, twoCard, ekManager, interaction, false)

                }
                else if (combo == 'three card') {

                }
                else if (combo == 'five card') {

                }
            }
            if (interaction.customId == PictureSelect.getCustomSelectMemberId())
                this.onSelectMember(ekManager, interaction)
            if (interaction.customId == PictureSelect.getCustomTwoCardSelectCardId())
                this.onSelectCard(ekManager, interaction)

        } catch (e) { }
    }

    async onSelectMember(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ) {
        if (interaction.isSelectMenu()) {
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
                        to.info.username +
                        ' is selecting card from ' + from.info.username
                    )
                )
            if (to.interaction) {
                const cardsMenu = new MessageSelectMenu()
                    .setCustomId(PictureSelect.getCustomTwoCardSelectCardId())
                    .setPlaceholder('Select one card')
                from.cards.forEach((c, idx) => {
                    cardsMenu.addOptions({
                        label: 'card ' + (idx + 1),
                        value: c.getCustomId(),
                    })
                })
                const embed = ekManager.getHandEmbed(
                    to,
                    'Select one card which you want '
                )
                to.interaction.editReply({
                    embeds: [embed],
                    components: [
                        new MessageActionRow().addComponents(cardsMenu),
                    ],
                })
            }
            if (from.interaction) {
                await from.interaction.editReply({
                    embeds: [
                        ekManager.getHandEmbed(
                            from,
                            `Wait for ${bold(
                                to.info.username
                            )} select one card from you`
                        ),
                    ],
                })
            }
            interaction.deferUpdate()

        }
    }

    async onSelectCard(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ) {
        if (interaction.isSelectMenu()) {
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
    }
}
