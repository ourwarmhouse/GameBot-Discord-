import {inlineCode} from '@discordjs/builders'
import {
    CacheType,
    Message,
    MessageActionRow,
    MessageButton,
    MessageComponentInteraction,
    MessageEmbed,
} from 'discord.js'
import {GameButton} from '.'
import ExplodingKittenManager from '../explodingKittenManager'
import {Defuse, ExplodingKitten} from '../gameObjects/card'

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
            const hand = ekManager.hands.find(
                (h) => h.info.id == interaction.user.id
            )
            if (!hand) throw new Error('Invalid hand')
            ekManager.setCurrentDrawCard(ekManager.getCurrentDrawCard() - 1)
            const card = ekManager.deck.cards.shift()
            if (!card) throw new Error('Empty deck')

            if (card.getLabel() == ExplodingKitten.name) {
                await ekManager.botMessage.edit(
                    await ekManager.getPlayingGameMessage(
                        hand.info.username + ' has draw Exploding Kitten',
                        card.getImageUrl()
                    )
                )
                const defuseCard = hand.cards.find(
                    (card) => card.getLabel() == Defuse.name
                )

                if (!defuseCard) {
                    ekManager.leave(hand.info.id)
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
                        ekManager.passTurn()
                    }
                } else {
                    let randomPosition = Math.floor(Math.random() * (ekManager.deck.cards.length - 1))
                    console.log("random position: ", randomPosition)
                    // card is exploding kitten
                    console.log("deck",ekManager.deck.cards)
                    ekManager.deck.insertAt(randomPosition,card)
                    hand.removeCard(defuseCard)
                    ekManager.passTurn()
                    if (ekManager.botMessage)
                        await ekManager.botMessage.edit(
                            await ekManager.getPlayingGameMessage(
                                hand.info.username +
                                    ' use ' +
                                    inlineCode(
                                        defuseCard.getEmoji() +
                                            ' ' +
                                            defuseCard.getLabel()
                                    ) +
                                    ' and safe after the exploding'
                            )
                        )
                }
            } else {
                hand.cards.push(card)
                hand.sortCard()
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
            }
        } catch (e) {
            console.log(e)
        }
    }
}
