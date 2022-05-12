import {inlineCode} from '@discordjs/builders'
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
            ekManager.setCurrentDrawCard(ekManager.getCurrentDrawCard() - 1)

            if (card.getLabel() == ExplodingKitten.name) {
                //you must be exploded if draw a exploding kitten card
                card.onClick(ekManager, interaction)
                // const hand = ekManager.hands.find(
                //     (h) => h.info.id == interaction.user.id
                // )
                // if (!hand) throw new Error('Invalid hand')
                // if (ekManager.botMessage) {
                //     await ekManager.botMessage.edit(
                //         await ekManager.getPlayingGameMessage(
                //             hand.info.username + ' has draw Exploding Kitten',
                //             card.getImageUrl()
                //         )
                //     )
                // }

                const defuseCard = hand.cards.find(
                    (card) => card.getLabel() == Defuse.name
                )

                if (!defuseCard) {
                    ekManager.leave(hand.info.id)
                    ekManager.setCurrentDrawCard(1)
                    if (ekManager._hands.length == 1) {
                        if (ekManager.botMessage)
                            await ekManager.botMessage.edit(
                                await ekManager.getPlayingGameMessage(
                                    ekManager._hands[0].info.username +
                                        ' won the game'
                                )
                            )
                        ekManager.stop()
                    } else {
                        if (ekManager.botMessage)
                            await ekManager.botMessage.edit(
                                await ekManager.getPlayingGameMessage(
                                    hand.info.username +
                                        ' has exploded and died'
                                )
                            )
                    }
                    await interaction.deferUpdate()
                    hand.interaction = interaction
                } else {
                    defuseCard.onClick(ekManager, interaction)
                    // const hand = ekManager.hands.find(
                    //     (h) => h.info.id == interaction.user.id
                    // )
                    // if (!hand) throw new Error('Invalid hand')

                    // hand.removeCard(defuseCard)
                    // ekManager.passTurn()
                    // if (ekManager.botMessage)
                    //     await ekManager.botMessage.edit(
                    //         await ekManager.getPlayingGameMessage(
                    //             hand.info.username +
                    //             ' use ' +
                    //             inlineCode(
                    //                 defuseCard.getEmoji() +
                    //                 ' ' +
                    //                 defuseCard.getLabel()
                    //             ) +
                    //             ' and safe after the exploding'
                    //         )
                    //     )
                    // defuseCard.dropCard(hand,ekManager,interaction)
                    let randomPosition = Math.floor(
                        Math.random() * (ekManager.deck.cards.length - 1)
                    )
                    //ekManager.deck.splice(position,0, card)
                    //this._cards = this._cards.splice(position,0, card)
                    //console.log("random position: ", randomPosition)
                    // card is exploding kitten
                    //console.log("deck", ekManager.deck.cards)
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
                if (ekManager.botMessage)
                    await ekManager.botMessage.edit(
                        await ekManager.getPlayingGameMessage(
                            hand.info.username + ' has draw a card'
                        )
                    )
                await interaction.deferUpdate()
                hand.interaction = interaction
            }
        } catch (e) {
            console.log(e)
        }
    }
}
