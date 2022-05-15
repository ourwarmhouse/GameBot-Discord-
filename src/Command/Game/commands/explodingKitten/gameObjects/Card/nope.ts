import {bold, inlineCode} from '@discordjs/builders'
import {CacheType, MessageComponentInteraction} from 'discord.js'
import {Card} from '.'
import ExplodingKittenManager from '../../explodingKittenManager'
import {Attack} from './attack'
import {Favor} from './favor'
import {Cat} from './picture'
import {SeeTheFuture} from './seeTheFuture'
import {Shuffle} from './shuffle'
import {Skip} from './skip'

export class Nope extends Card {
    getEmoji(): string {
        return '⛔'
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
            const nopeCardString = this.getEmoji() + ' ' + this.getLabel()

            const history = ekManager.history.pop()
            if (!history) {
                if (hand.interaction) {
                    hand.interaction.editReply(
                        ekManager.getHandMessage(
                            hand,
                            "You can't use " +
                                inlineCode(nopeCardString) +
                                ' in this case'
                        )
                    )
                }
                await interaction.deferUpdate()
                hand.interaction = interaction
                return
            }
            if (history.hand.info.id == hand.info.id) {
                ekManager.history.push(history)
                if (hand.interaction) {
                    hand.interaction.editReply(
                        ekManager.getHandMessage(
                            hand,
                            "You can't use " +
                                inlineCode(nopeCardString) +
                                ' yourself'
                        )
                    )
                }
                await interaction.deferUpdate()
                hand.interaction = interaction
                return
            }
            const cardsInHistory = history.cards
            if (
                !cardsInHistory[0] ||
                cardsInHistory[0].getLabel() == this.constructor.name
            ) {
                if (hand.interaction) {
                    hand.interaction.editReply(
                        ekManager.getHandMessage(
                            hand,
                            "You can't use " +
                                inlineCode(nopeCardString) +
                                ' in this case'
                        )
                    )
                }
                await interaction.deferUpdate()
                hand.interaction = interaction
                return
            }

            const historyCardString =
                cardsInHistory[0].getEmoji() +
                ' ' +
                cardsInHistory[0].getLabel()
            if (cardsInHistory[0].getLabel() == Attack.name) {
                ekManager.setCurrentDrawCard(history.currentDrawCard)
                ekManager.revertTurn(history.hand)
                await ekManager.updateGeneralMessage(
                    `${bold(hand.info.username)} have nope ${bold(
                        history.hand.info.username
                    )} \n` +
                        `${bold(history.hand.info.username)} can't use ${bold(
                            historyCardString
                        )}`,
                    this.getImageUrl()
                )
                ekManager.dropCard(hand, [this])
            } else if (cardsInHistory[0].getLabel() == Skip.name) {
                ekManager.setCurrentDrawCard(history.currentDrawCard)
                ekManager.revertTurn(history.hand)
                await ekManager.updateGeneralMessage(
                    `${bold(hand.info.username)} have nope ${bold(
                        history.hand.info.username
                    )} \n` +
                        `${bold(history.hand.info.username)} can't use ${bold(
                            historyCardString
                        )}`,
                    this.getImageUrl()
                )
                ekManager.dropCard(hand, [this])
            } else if (cardsInHistory[0].getLabel() == Favor.name) {
                await ekManager.updateGeneralMessage(
                    bold(hand.info.username) +
                        ' have nope ' +
                        bold(history.hand.info.username),
                    this.getImageUrl()
                )
                ekManager.updateEntireHandMesssage()
                ekManager.dropCard(hand, [this])
            } else if (cardsInHistory[0].getLabel() == Shuffle.name) {
                await ekManager.updateGeneralMessage(
                    bold(hand.info.username) +
                        ' have nope ' +
                        bold(history.hand.info.username),
                    this.getImageUrl()
                )
                ekManager.updateEntireHandMesssage()
                ekManager.dropCard(hand, [this])
            } else if (cardsInHistory[0].getLabel() == SeeTheFuture.name) {
                await ekManager.updateGeneralMessage(
                    bold(hand.info.username) +
                        ' have nope ' +
                        bold(history.hand.info.username),
                    this.getImageUrl()
                )
                ekManager.updateEntireHandMesssage()
                ekManager.dropCard(hand, [this])
            } else if (Cat.isCat(cardsInHistory[0])) {
                const numOfSameTypeCard = cardsInHistory.filter(
                    (c) => c.getLabel() == cardsInHistory[0].getLabel()
                )
                const numOfCatCard = cardsInHistory.filter((c) => Cat.isCat(c))
                if (numOfSameTypeCard.length >= 2) {
                    ekManager.updateGeneralMessage(
                        bold(hand.info.username) +
                            ' have nope ' +
                            bold(history.hand.info.username),
                        this.getImageUrl()
                    )
                    ekManager.updateEntireHandMesssage()
                    ekManager.dropCard(hand, [this])
                }

                // if (numOfSameTypeCard.length >= 3) {
                // }

                if (numOfCatCard.length >= 5) {
                    ekManager.updateGeneralMessage(
                        bold(hand.info.username) +
                            ' have nope ' +
                            bold(history.hand.info.username),
                        this.getImageUrl()
                    )
                    ekManager.updateEntireHandMesssage()
                    ekManager.dropCard(hand, [this])
                }
            } else {
                if (hand.interaction) {
                    hand.interaction.editReply(
                        ekManager.getHandMessage(
                            hand,
                            "You can't use " +
                                inlineCode(nopeCardString) +
                                ' in this case'
                        )
                    )
                }
            }

            await interaction.deferUpdate()
            hand.interaction = interaction
        } catch (e) {
            console.log(e)
        }
    }
}
