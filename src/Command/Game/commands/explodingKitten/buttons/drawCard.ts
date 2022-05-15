import {bold, inlineCode} from '@discordjs/builders'
import {CacheType, MessageButton, MessageComponentInteraction} from 'discord.js'
import {GameButton} from '.'
import ExplodingKittenManager from '../explodingKittenManager'
import {Defuse} from '../gameObjects/Card/defuse'
import {ExplodingKitten} from '../gameObjects/Card/explodingKitten'

export class DrawCards extends GameButton {
    getCustomId(): string {
        return 'Draw'
    }
    getComponent(): MessageButton {
        return new MessageButton()
            .setLabel(this.getCustomId())
            .setCustomId(this.getCustomId())
            .setStyle(4)
    }

    async onClick(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ) {
        try {
            if (interaction.customId != this.getCustomId()) return
            const hand = ekManager.hands.find(
                (h) => h.info.id == interaction.user.id
            )
            if (!hand) throw new Error('Invalid hand')
            const card = ekManager.deck.cards.shift()
            if (!card) throw new Error('Empty deck')
            ekManager.setCurrentDrawCard(ekManager.currentDrawCard - 1)

            if (card.getLabel() == ExplodingKitten.name) {
                //you must be exploded if draw a exploding kitten card
                card.onClick(ekManager, interaction)

                const defuseCard = hand.cards.find(
                    (card) => card.getLabel() == Defuse.name
                )

                if (!defuseCard) {
                    ekManager.leave(hand.info.id)
                    ekManager.setCurrentDrawCard(1)
                    if (ekManager._hands.length == 1) {
                        ekManager.stop()
                    } else {
                        ekManager.updateGeneralMessage(
                            hand.info.username + ' has exploded and died'
                        )
                    }
                    await interaction.deferUpdate()
                    hand.interaction = interaction
                } else {
                    defuseCard.onClick(ekManager, interaction)

                    let randomPosition = Math.floor(
                        Math.random() * (ekManager.deck.cards.length - 1)
                    )
                    let length = ekManager.deck.cards.length
                    if (length == 0) {
                        ekManager.deck.insertAt(0, card)
                    } else {
                        ekManager.deck.insertAt(randomPosition, card)
                    }
                }
            } else {
                hand.cards.push(card)
                ekManager.passTurn()
                if (hand.interaction) {
                    hand.interaction.editReply(
                        ekManager.getHandMessage(
                            hand,
                            'You have draw ' +
                                inlineCode(
                                    card.getEmoji() + ' ' + card.getLabel()
                                ),
                            card.getImageUrl()
                        )
                    )
                }
                ekManager.updateGeneralMessage(
                    bold(hand.info.username) + ' has draw a card'
                )

                await interaction.deferUpdate()
                hand.interaction = interaction
            }
        } catch (e) {
            console.log(e)
        }
    }
}
