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
import {DrawCards} from './drawCard'
import {SortCards} from './sortHandCard'

export class ViewCards extends GameButton {
    getCustomId(): string {
        return 'View Cards'
    }
    getComponent(): MessageButton {
        return new MessageButton()
            .setLabel(this.getCustomId())
            .setCustomId(this.getCustomId())
            .setStyle(2)
    }

    async onClick(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ) {
        if (interaction.customId != this.getCustomId()) return

        const hand = ekManager.hands.find(
            (h) => h.info.id == interaction.user.id
        )
        if (!hand) return
        // const theSecondClick = new MessageButton()
        //     .setLabel('Click here to see cards')
        //     .setStyle(3)
        //     .setCustomId('View')
        // const row = new MessageActionRow().addComponents(theSecondClick)

        interaction.reply({
            ...ekManager.getHandMessage(hand),
            ephemeral: true,
        })
        hand.interaction = interaction
        // const btnCollector =
        //     ekManager.message.channel.createMessageComponentCollector({
        //         filter: (msg) => msg.user.id == myHand.info.id,
        //     })
        // btnCollector.on('collect', async (i) => {
        //     try {
        //         const drawCardButton = new DrawCards()
        //         const sortCardButton = new SortCards()

        //         if (i.customId == 'View') {
        //             i.reply({content: 'Load card...', ephemeral: true})
        //             await myHand.interaction.editReply(
        //                 ekManager.getHandMessage(myHand)
        //             )
        //         } else if (i.customId == drawCardButton.getCustomId()) {
        //             i.editReply('Draw card...')
        //             drawCardButton.onClick(ekManager, myHand.interaction)

        //         } else if (i.customId == sortCardButton.getCustomId()) {
        //             i.editReply('Draw card...')
        //         }
        //         else {
        //             i.editReply('Drop card...')
        //             myHand.onDropCard(ekManager, i)
        //         }

        //         // })
        //     } catch (e) {
        //         console.log(e)
        //     }
        // })
    }
}
