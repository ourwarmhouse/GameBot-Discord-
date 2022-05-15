import {bold, inlineCode} from '@discordjs/builders'
import {
    CacheType,
    MessageActionRow,
    MessageComponentInteraction,
    MessageSelectMenu,
} from 'discord.js'
import ExplodingKittenManager from '../explodingKittenManager'
import {Card} from '../gameObjects/Card'
import {Cat} from '../gameObjects/Card/picture'
import {Hand} from '../gameObjects/hand'

export class PictureSelect {
    public owner!: Hand
    public selectedHand!: Hand
    public selectedCard!: Card

    static getCustomSelectComboId(): string {
        return 'Picture Select Combo Cards'
    }
    static getCustomTwoCardSelectMemberId(): string {
        return 'Picture Two Card Select Member'
    }
    static getCustomTwoCardSelectCardId(): string {
        return 'Picture Two Card Select Card'
    }

    static getCustomThreeCardSelectMemberId(): string {
        return 'Picture Three Card Select Member'
    }
    static getCustomThreeCardSelectCardId(): string {
        return 'Picture Three Card Select Card'
    }
    static getCustomFiveCardSelectDroppedCard(): string {
        return 'Picture Five Card Select Dropped Card'
    }

    async onSelect(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {
        try {
            if (!interaction.isSelectMenu()) return
            if (
                interaction.customId == PictureSelect.getCustomSelectComboId()
            ) {
                const hand = ekManager.hands.find(
                    (h) => h.info.id == interaction.user.id
                )
                if (!hand) throw new Error()
                const combo = interaction.values[0]
                    .split(' ')
                    .slice(0, 2)
                    .join(' ')
                const cardLabel = interaction.values[0]
                    .split(' ')
                    .slice(2, 3)[0]
                if (combo == 'two card') {
                    const twoCard = hand.cards
                        .filter((c) => c.getLabel() == cardLabel)
                        .slice(0, 2)
                    const representCard = twoCard[0]
                    if (twoCard.length < 2) throw new Error()

                    const description =
                        hand.info.username +
                        ' use 2 card ' +
                        inlineCode(
                            representCard.getEmoji() +
                                ' ' +
                                representCard.getLabel()
                        ) +
                        ' and selecting a player to steal one card'
                    await ekManager.updateGeneralMessage(
                        description,
                        representCard.getImageUrl()
                    )

                    const embed = ekManager.getHandEmbed(
                        hand,
                        'Choose the player who you want to take the card'
                    )
                    const handsExcepteMe = ekManager.hands.filter(
                        (h) => h.info.id !== hand.info.id
                    )
                    const memberMenu = new MessageSelectMenu()
                        .setCustomId(
                            PictureSelect.getCustomTwoCardSelectMemberId()
                        )
                        .setPlaceholder('Select one player')

                    for (const h of handsExcepteMe)
                        memberMenu.addOptions({
                            value: h.info.id,
                            label: h.info.username,
                        })

                    if (hand.interaction) {
                        await hand.interaction.editReply({
                            embeds: [embed],
                            components: [
                                new MessageActionRow().addComponents(
                                    memberMenu
                                ),
                            ],
                        })
                    }
                    ekManager.dropCard(hand, twoCard, false)
                    ekManager.updateHistory(hand, twoCard)

                    await interaction.deferUpdate()
                    hand.interaction = interaction
                } else if (combo == 'three card') {
                    const threeCard = hand.cards
                        .filter((c) => c.getLabel() == cardLabel)
                        .slice(0, 3)
                    const representCard = threeCard[0]
                    if (threeCard.length < 3) throw new Error()

                    const description =
                        hand.info.username +
                        ' use 3 card ' +
                        inlineCode(
                            representCard.getEmoji() +
                                ' ' +
                                representCard.getLabel()
                        ) +
                        ' and selecting a player to steal exactly one card'
                    await ekManager.updateGeneralMessage(
                        description,
                        representCard.getImageUrl()
                    )

                    const embed = ekManager.getHandEmbed(
                        hand,
                        'Choose the player who you want to take the card'
                    )
                    const handsExcepteMe = ekManager.hands.filter(
                        (h) => h.info.id !== hand.info.id
                    )
                    const memberMenu = new MessageSelectMenu()
                        .setCustomId(
                            PictureSelect.getCustomThreeCardSelectMemberId()
                        )
                        .setPlaceholder('Select one player')

                    for (const h of handsExcepteMe)
                        memberMenu.addOptions({
                            value: h.info.id,
                            label: h.info.username,
                        })

                    if (hand.interaction) {
                        await hand.interaction.editReply({
                            embeds: [embed],
                            components: [
                                new MessageActionRow().addComponents(
                                    memberMenu
                                ),
                            ],
                        })
                    }
                    ekManager.dropCard(hand, threeCard, false)
                    ekManager.updateHistory(hand, threeCard)
                    await interaction.deferUpdate()
                    hand.interaction = interaction
                } else if (combo == 'five card') {
                    if (ekManager.deck.droppedCards.length == 0) {
                        if (hand.interaction) {
                            await hand.interaction.editReply(
                                ekManager.getHandMessage(
                                    hand,
                                    "Can't use this combo because the game has started"
                                )
                            )
                        }
                        await interaction.deferUpdate()
                        hand.interaction = interaction
                        return
                    }

                    const fiveCards = hand.cards
                        .filter((c) => Cat.isCat(c))
                        .slice(0, 5)
                    if (fiveCards.length < 5) throw new Error()
                    const representCard = fiveCards[0]
                    this.owner = hand
                    const listOfCardsUseString = fiveCards
                        .map((c) =>
                            inlineCode(c.getEmoji() + ' ' + c.getLabel())
                        )
                        .join('\n')
                    const description =
                        hand.info.username +
                        ' use 5 card \n' +
                        listOfCardsUseString +
                        '\nand selecting one card from dropped deck'
                    await ekManager.updateGeneralMessage(
                        description,
                        representCard.getImageUrl()
                    )
                    const embed = ekManager.getHandEmbed(
                        hand,
                        'Choose one card from the dropped deck'
                    )
                    const cardMenu = new MessageSelectMenu()
                        .setCustomId(
                            PictureSelect.getCustomFiveCardSelectDroppedCard()
                        )
                        .setPlaceholder('Select one card')

                    for (const c of ekManager.deck.droppedCards) {
                        cardMenu.addOptions({
                            value: c.getCustomId(),
                            label: c.getEmoji() + ' ' + c.getLabel(),
                        })
                    }
                    if (hand.interaction) {
                        await hand.interaction.editReply({
                            embeds: [embed],
                            components: [
                                new MessageActionRow().addComponents(cardMenu),
                            ],
                        })
                    }
                    ekManager.dropCard(hand, fiveCards, false)
                    ekManager.updateHistory(hand, fiveCards)
                    await interaction.deferUpdate()
                    hand.interaction = interaction
                }
            }
            if (
                interaction.customId ==
                PictureSelect.getCustomTwoCardSelectMemberId()
            )
                this.onTwoCardSelectMember(ekManager, interaction)
            if (
                interaction.customId ==
                PictureSelect.getCustomTwoCardSelectCardId()
            )
                this.onSelectHandCard(ekManager, interaction)

            if (
                interaction.customId ==
                PictureSelect.getCustomThreeCardSelectMemberId()
            )
                this.onThreeCardSelectMember(ekManager, interaction)
            if (
                interaction.customId ==
                PictureSelect.getCustomThreeCardSelectCardId()
            )
                this.onSelectSpecificCard(ekManager, interaction)
            if (
                interaction.customId ==
                PictureSelect.getCustomFiveCardSelectDroppedCard()
            )
                this.onSelectDroppedCard(ekManager, interaction)
        } catch (e) {}
    }

    async onTwoCardSelectMember(
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
            const description =
                to.info.username +
                ' will steal a card from ' +
                from.info.username +
                '\n' +
                to.info.username +
                ' is selecting card from ' +
                from.info.username
            ekManager.updateGeneralMessage(description)

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

    async onSelectHandCard(
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
            ekManager.updateEntireHandMesssage()

            const cardString = inlineCode(
                card.getEmoji() + ' ' + card.getLabel()
            )
            if (this.selectedHand.interaction) {
                this.selectedHand.interaction.editReply({
                    embeds: [
                        ekManager.getHandEmbed(
                            this.selectedHand,
                            'You have lost ' + cardString,
                            card.getImageUrl()
                        ),
                    ],
                })
            }
            if (this.owner.interaction) {
                this.owner.interaction.editReply({
                    embeds: [
                        ekManager.getHandEmbed(
                            this.selectedHand,
                            'You have stolen ' + cardString,
                            card.getImageUrl()
                        ),
                    ],
                })
            }

            const description =
                bold(this.owner.info.username) +
                ' has stolen a card from ' +
                bold(this.selectedHand.info.username)
            await ekManager.updateGeneralMessage(
                description,
                card.getImageUrl()
            )
            interaction.deferUpdate()
        }
    }

    async onThreeCardSelectMember(
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
            const description =
                to.info.username +
                ' will steal a card from ' +
                from.info.username +
                '\n' +
                to.info.username +
                ' is selecting card from ' +
                from.info.username
            await ekManager.updateGeneralMessage(description)

            if (to.interaction) {
                const cardsMenu = new MessageSelectMenu()
                    .setCustomId(PictureSelect.getCustomThreeCardSelectCardId())
                    .setPlaceholder(
                        `Which card you think ${from.info.username} have`
                    )
                ekManager.deck.typeCard.forEach((c) => {
                    cardsMenu.addOptions({
                        label: c.emoji + ' ' + c.label,
                        value: c.label,
                    })
                })
                const embed = ekManager.getHandEmbed(
                    to,
                    `If ${bold(
                        from.info.username
                    )} doesn't have this card, you will steal ${inlineCode(
                        'no card'
                    )}`
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
                            )} guess the card you have`
                        ),
                    ],
                })
            }
            interaction.deferUpdate()
        }
    }

    async onSelectSpecificCard(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ) {
        if (interaction.isSelectMenu()) {
            if (!this.selectedHand) return
            const card = this.selectedHand.cards.find(
                (c) => c.getLabel() == interaction.values[0]
            )
            if (card) {
                // from
                this.selectedHand.removeCard(card)
                // to
                this.owner.cards.push(card)
                ekManager.updateEntireHandMesssage()

                const cardString = inlineCode(
                    card.getEmoji() + ' ' + card.getLabel()
                )
                if (this.selectedHand.interaction) {
                    this.selectedHand.interaction.editReply({
                        embeds: [
                            ekManager.getHandEmbed(
                                this.selectedHand,
                                'You have lost ' + cardString,
                                card.getImageUrl()
                            ),
                        ],
                    })
                }
                if (this.owner.interaction) {
                    this.owner.interaction.editReply({
                        embeds: [
                            ekManager.getHandEmbed(
                                this.selectedHand,
                                'You have stolen ' + cardString,
                                card.getImageUrl()
                            ),
                        ],
                    })
                }

                const description =
                    bold(this.owner.info.username) +
                    ' has stolen a card from ' +
                    bold(this.selectedHand.info.username)
                ekManager.updateGeneralMessage(description, card.getImageUrl())
            } else {
                const cardString = interaction.values[0]
                if (this.selectedHand.interaction) {
                    this.selectedHand.interaction.editReply({
                        embeds: [
                            ekManager.getHandEmbed(
                                this.selectedHand,
                                bold(this.owner.info.username) +
                                    ' think you have ' +
                                    inlineCode(cardString) +
                                    ' and has stolen no card from you'
                            ),
                        ],
                    })
                }
                if (this.owner.interaction) {
                    this.owner.interaction.editReply(
                        ekManager.getHandMessage(
                            this.owner,
                            'Your predict is wrong. You have stolen no card from ' +
                                bold(this.selectedHand.info.username)
                        )
                    )
                }
                const description =
                    bold(this.owner.info.username + "'s") +
                    ' predict is wrong and steal no card from ' +
                    bold(this.selectedHand.info.username)
                await ekManager.updateGeneralMessage(description)
            }
            interaction.deferUpdate()
        }
    }

    async onSelectDroppedCard(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ) {
        if (interaction.isSelectMenu()) {
            const card = ekManager.deck.droppedCards.find(
                (c) => c.getCustomId() == interaction.values[0]
            )
            console.log(card)
            if (!card) return
            this.owner.cards.push(card)
            ekManager.updateEntireHandMesssage()

            const cardString = inlineCode(
                card.getEmoji() + ' ' + card.getLabel()
            )
            if (this.owner.interaction) {
                this.owner.interaction.editReply({
                    embeds: [
                        ekManager.getHandEmbed(
                            this.owner,
                            'You have get ' + cardString,
                            card.getImageUrl()
                        ),
                    ],
                })
            }

            const description =
                bold(this.owner.info.username) +
                ' has got ' +
                cardString +
                ' from the dropped deck'
            await ekManager.updateGeneralMessage(
                description,
                card.getImageUrl()
            )

            interaction.deferUpdate()
        }
    }
}
