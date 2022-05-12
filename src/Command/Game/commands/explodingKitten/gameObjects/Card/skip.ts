import {inlineCode} from '@discordjs/builders'
import {CacheType, MessageComponentInteraction} from 'discord.js'
import {Card} from '.'
import ExplodingKittenManager from '../../explodingKittenManager'

export class Skip extends Card {
    getEmoji(): string {
        return '⏩'
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
            // let current = ekManager.getCurrentDrawCard()
            // if (current > 1){
            //     current--
            // } else {

            // }
            ekManager.setCurrentDrawCard(ekManager.getCurrentDrawCard() - 1)
            ekManager.passTurn()
            super.dropCard(hand, ekManager, interaction)
            if (ekManager.botMessage)
                await ekManager.botMessage.edit(
                    await ekManager.getPlayingGameMessage(
                        hand.info.username +
                            ' use ' +
                            inlineCode(this.getEmoji() + ' ' + this.getLabel())
                    )
                )
        } catch (e) {
            console.log(e)
            interaction.reply({content: 'Please try again', ephemeral: true})
        }
    }
}
