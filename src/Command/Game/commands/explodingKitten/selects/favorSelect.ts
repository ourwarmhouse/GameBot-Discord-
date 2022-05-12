import {
    CacheType,
    MessageActionRow,
    MessageComponentInteraction,
    MessageSelectMenu
} from 'discord.js'
import { GameSelect } from '.'
import ExplodingKittenManager from '../explodingKittenManager'
import { Card } from '../gameObjects/Card'
import { Hand } from '../gameObjects/hand'

export class FavorSelect extends GameSelect {
    public owner!: Hand
    public selectedHand!: Hand
    public selectedCard!: Card
    constructor() {
        super()
    }
    getCustomId(): string {
        return 'Favor Select'
    }
    getComponent(): MessageSelectMenu {
        const menu = new MessageSelectMenu()

        return menu
    }
    async onSelect(
        ekManager: ExplodingKittenManager,
        interaction: MessageComponentInteraction<CacheType>
    ): Promise<void> {
        try {
            if (interaction.customId == 'select member' && interaction.isSelectMenu()) {
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
                            from.info.username + '\n' + from.info.username +
                            ' is selecting card for ' + to.info.username
                        )
                    )
                if (from.interaction) {
                    const cardsMenu = new MessageSelectMenu()
                        .setCustomId('select card')
                        .setPlaceholder('Choose')
                    for (const card of from.cards)
                        cardsMenu.addOptions({
                            label: card.getEmoji() + ' ' + card.getLabel(),
                            value: card.getCustomId(),
                        })
                    from.interaction.editReply({
                        embeds: [ekManager.getHandEmbed(from)],
                        components: [
                            new MessageActionRow().addComponents(cardsMenu),
                        ],
                    })
                }
                if (to.interaction) {
                    await to.interaction.editReply(ekManager.getHandMessage(to))
                }
                interaction.deferUpdate()
            }
            else if (interaction.customId == 'select card' && interaction.isSelectMenu()) {
                if (!this.selectedHand) return
                const card = this.selectedHand.cards.find(
                    (c) =>
                        c.getCustomId() == interaction.values[0]
                )
                console.log("selected card:",card)
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
                            this.owner.info.username +
                            ' has stolen a card'
                        )
                    )
                interaction.deferUpdate() 
            }
        }
        catch (e) {
            
        }
    }
}
