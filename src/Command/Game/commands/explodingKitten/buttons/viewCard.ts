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
        if (interaction.customId == this.getCustomId() && interaction.channel) {
            const myHand = ekManager.hands.find(
                (h) => h.info.id == interaction.user.id
            )
            if (!myHand) return
            const theSecondClick = new MessageButton()
                .setLabel('Click here to see cards')
                .setStyle(3)
                .setCustomId('View')
            const row = new MessageActionRow().addComponents(theSecondClick)

            myHand.interaction = interaction

            myHand.interaction.reply({
                content: 'Please click the below button',
                components: [row],
                ephemeral: true,
            })

            const btnCollector =
                ekManager.message.channel.createMessageComponentCollector({
                    filter: (msg) => msg.user.id == myHand.info.id,
                })
            btnCollector.on('collect', async (i) => {
                try {
                    const drawCardButton = new DrawCards()

                    if (i.customId == 'View') {
                        i.reply('Load card...')
                        i.deleteReply()
                        await myHand.interaction.editReply({
                            embeds: [ekManager.getHandEmbed(myHand)],
                            components: ekManager.getHandButtons(myHand),
                        })
                    } else if (i.customId == drawCardButton.getCustomId()) {
                        i.reply('Draw card...')
                        i.deleteReply()
                        drawCardButton.onClick(ekManager, myHand.interaction)
                    } else {
                        i.reply('Drop card...')
                        i.deleteReply()
                        myHand.onDropCard(ekManager, i)
                    }
                    // if (!i.channel) return
                    // const btnClt = i.channel?.createMessageComponentCollector({
                    //     filter: (msg) => msg.user.id == myHand.info.id,
                    // })
                    // btnClt.on('collect', (inter) => {

                    // })
                } catch (e) {
                    console.log(e)
                }
                // await i.reply({content:'Load your card ...',ephemeral:true})
            })
            // .on('end', async () => {
            //     const a = (await interaction.editReply({
            //         embeds: [ekManager.getHandEmbed(myHand)],
            //         components: ekManager.getHandButtons(myHand),
            //     }))
            //     const b = interaction.message
            //     // b.({content:'Edit content'})
            //     myHand.onDropCard(ekManager)
            // })
        }
    }
}
