import { bold, inlineCode } from '@discordjs/builders'
import {
    CacheType,
    InteractionCollector,
    Message,
    MessageActionRow,
    MessageComponentInteraction,
    MessageEmbed,
    ReplyMessageOptions,
    User,
} from 'discord.js'
import e from 'express'
import MessageHandler from 'Handler/message'
import { uid } from 'uid'
import GameManager from '../../../Game'
import UserManager from '../../../User'
import { Back } from './buttons/back'
import { Destroy } from './buttons/destroy'
import { DrawCards } from './buttons/drawCard'
import { Join } from './buttons/join'
import { Leave } from './buttons/leave'
import { ShuffleCards } from './buttons/shuffleHandCard'
import { SortCards } from './buttons/sortHandCard'
import { Start } from './buttons/start'
import { ViewCards } from './buttons/viewCard'
import { Card } from './gameObjects/Card'
import { Defuse } from './gameObjects/Card/defuse'
import { Cat } from './gameObjects/Card/picture'
import { Deck } from './gameObjects/deck'
import { Hand } from './gameObjects/hand'
import { FavorSelect } from './selects/favorSelect'
import { PictureSelect } from './selects/pictureSelect'

export default class ExplodingKittenManager {
    public id: string
    public _hands: Hand[]
    private _master!: Hand
    private _userManager: UserManager
    private _botMessage!: Message
    private _buttonCollector!: InteractionCollector<
        MessageComponentInteraction<CacheType>
    >
    public deck!: Deck
    private _turn: number
    private _currentDrawCard: number // number of card current player has to draw
    // private _nextDrawCard: number // number of card next player has to draw

    // public state: State
    constructor(
        private _messageHandler: MessageHandler,
        private _message: Message<boolean>,
        private _gameManager: GameManager,
        private _betNumber: number
    ) {
        this._currentDrawCard = 1
        this.id = uid()
        this._hands = []
        this._turn = 0
        this._userManager = _gameManager.userManager
    }

    public getHandEmbed(
        hand: Hand,
        insertDescription?: string,
        thumbnailPath?: string
    ): MessageEmbed {
        const turn = this.hands[this.turn]
        const info = hand.info
        const isMyTurn = info.id == turn.info.id
        const isInGame = this.hands.find((h) => h.info.id == info.id)
        const turnString =
            info.id == turn.info.id
                ? 'This is your turn ✅'
                : 'This is not your turn ❌'
        const outString = 'You have died'
        const embed = new MessageEmbed()
            // .setDescription(`You have ${hand.cards.length} cards`)
            .setAuthor({
                name: isInGame ? turnString : outString,
                iconURL: info.avatarURL() || info.defaultAvatarURL,
            })
            .setColor(isMyTurn ? 'GREEN' : 'RED')
        if (isMyTurn)
            embed.setTitle(
                `You have to draw ${this._currentDrawCard} ${this._currentDrawCard > 1 ? 'cards' : 'card'
                }`
            )
        if (insertDescription) embed.setDescription(insertDescription)
        if (thumbnailPath) embed.setThumbnail(thumbnailPath)
        return embed
    }
    public getHandButtons(hand: Hand): MessageActionRow[] {
        const turn = this.hands[this.turn]
        const info = hand.info
        const isMyTurn = info.id == turn.info.id
        const isInGame = this.hands.find((h) => h.info.id == info.id)

        const numOfButton = hand.cards.length + 1
        const drawCardButton = new DrawCards()
            .getComponent()
            .setDisabled(!isMyTurn || !isInGame)

        // fuck discord
        const maxColumnPerRow = 5
        const maxRow =
            Math.trunc(numOfButton / maxColumnPerRow) +
            (numOfButton % maxColumnPerRow != 0 ? 1 : 0)
        const rowList = []
        for (let row = 0; row < maxRow; ++row) {
            const r = new MessageActionRow()
            for (let column = 0; column < maxColumnPerRow; ++column) {
                const currentCardIndex = column + maxColumnPerRow * row
                if (!hand.cards[currentCardIndex]) {
                    r.addComponents(drawCardButton)
                    break
                } else {
                    const card = hand.cards[currentCardIndex]

                    let cardComponent
                    if (card.constructor.name == Defuse.name)
                        cardComponent = card.getComponent().setDisabled(true)
                    else if (Cat.isCat(card)) {
                        const comboTwoOrThreeCards = hand.cards.filter(
                            (c) => c.getLabel() == card.getLabel()
                        )
                        const comboFiveCards = hand.cards.filter((c) =>
                            Cat.isCat(c)
                        )
                        cardComponent = card.getComponent()
                        if (
                            comboTwoOrThreeCards.length <= 1 &&
                            comboFiveCards.length < 5
                        )
                            cardComponent.setDisabled(true)
                        else {
                            cardComponent.setDisabled(!isMyTurn || !isInGame)
                        }
                    } else
                        cardComponent = card
                            .getComponent()
                            .setDisabled(!isMyTurn || !isInGame)
                    r.addComponents(cardComponent)
                }
            }
            rowList.push(r)
        }
        const sortCardsButton = new SortCards()
            .getComponent()
            .setDisabled(!isInGame)
        const shuffleCardsButton = new ShuffleCards()
            .getComponent()
            .setDisabled(!isInGame)
        const utilitiesRow = new MessageActionRow()
        utilitiesRow.addComponents(sortCardsButton, shuffleCardsButton)
        rowList.push(utilitiesRow)
        return rowList
    }
    public getHandMessage(
        hand: Hand,
        insertDescription?: string,
        thumbnailPath?: string
    ): ReplyMessageOptions {
        const embed = this.getHandEmbed(hand, insertDescription, thumbnailPath)
        const buttons = this.getHandButtons(hand)

        const isInGame = this.hands.find((h) => h.info.id == hand.info.id)
        if (!isInGame) {
            const embed = this.getHandEmbed(hand)
            embed.setTitle('You died')
            embed.setDescription("don't be hurt")
            embed.setImage('https://art.pixilart.com/62256959cd49d04.gif')
            return { embeds: [embed], components: [] }
        } else {
            return { embeds: [embed], components: buttons }
        }
    }

    public async getPlayingGameMessage(
        insertDescription?: string,
        thumbnailPath?: string
    ): Promise<ReplyMessageOptions> {
        const info = this._hands[this._turn].info
        const { username, defaultAvatarURL, id } = info

        if (!insertDescription)
            insertDescription = `Click ${inlineCode(
                'View Cards'
            )} to see your cards`
        const drawCardString =
            bold(username) +
            ' have to draw ' +
            bold(
                this._currentDrawCard.toString() +
                (this._currentDrawCard == 1 ? ' card' : ' cards')
            )

        const userList = this._hands
            .map((h) =>
                h.info.id == id
                    ? bold(
                        `${h.isMaster ? '👑' : '👤'} ${h.info.username} (${h.cards.length
                        } cards)`
                    )
                    : `${h.isMaster ? '👑' : '👤'} ${h.info.username} (${h.cards.length
                    } cards)`
            )
            .join('\n')

        const embed = new MessageEmbed()
            .setTitle(
                `🐱‍👓 Exploding Kittens (remain ${this.deck.cards.length} cards)`
            )
            .setAuthor({
                name: username + `'s turn`,
                iconURL: info.avatarURL() || defaultAvatarURL,
            })

        if (this.hands.length == 1) {
            embed.setDescription(insertDescription)
            embed.setImage(
                'https://media1.giphy.com/media/ZYL86UZ7MjeIPDZ4xp/giphy.gif?cid=ecf05e47fp6c3eh9odttk4ma49ljqj425g6ianf2hy2m1v8z&rid=giphy.gif&ct=g'
            )
        } else
            embed.setDescription(
                drawCardString + '\n\n' + insertDescription + '\n\n' + userList
            )

        if (thumbnailPath) embed.setThumbnail(thumbnailPath)

        const viewCardsButton = new ViewCards().getComponent()
        const destroyButton = new Destroy().getComponent()
        const memberButtons = new MessageActionRow().addComponents(
            viewCardsButton,
            destroyButton
        )

        if (this.hands.length == 1)
            return {
                embeds: [embed],
                components: [],
            }
        else
            return {
                embeds: [embed],
                components: [memberButtons],
            }
    }

    public async getInitGameMessage() {
        const { username, defaultAvatarURL } = this._message.author
        const introducedString =
            username + ' has started a game of Exploding Kittens!'

        const userList = this._hands
            .map((h) => `${h.isMaster ? '👑' : '👤'} ${h.info.username}`)
            .join('\n')

        const embed = new MessageEmbed()
            .setTitle('🐱‍👓 Exploding Kittens')
            .setDescription(introducedString + '\n\n' + userList)
            .setAuthor({
                name: username,
                iconURL: this._message.author.avatarURL() || defaultAvatarURL,
            })

        const joinButton = new Join().getComponent()
        const leaveButton = new Leave().getComponent()
        const memberButtons = new MessageActionRow().addComponents(
            joinButton,
            leaveButton
        )
        const startButton = new Start().getComponent()
        const destroyButton = new Destroy().getComponent()
        const masterButtons = new MessageActionRow().addComponents(
            startButton,
            destroyButton
        )

        return {
            embeds: [embed],
            components: [masterButtons, memberButtons],
        }
    }

    public async initGameMessage() {
        try {
            this._botMessage = await this._message.channel.send(
                await this.getInitGameMessage()
            )
            this._buttonCollector =
                this._message.channel.createMessageComponentCollector()

            const startButton = new Start()
            const joinButton = new Join()
            const leaveButton = new Leave()
            const destroyButton = new Destroy()
            const viewCardsButton = new ViewCards()

            const favorSelect = new FavorSelect()
            const pictureSelect = new PictureSelect()

            this._buttonCollector.on('collect', async (interaction) => {
                if (interaction.isSelectMenu()) {
                    favorSelect.onSelect(this, interaction)
                    pictureSelect.onSelect(this, interaction)
                } else if (interaction.isButton()) {
                    startButton.onClick(this, interaction)
                    joinButton.onClick(this, interaction)
                    destroyButton.onClick(this, interaction)
                    leaveButton.onClick(this, interaction)
                    viewCardsButton.onClick(this, interaction)

                    const hand = this.hands.find(
                        (h) => h.info.id == interaction.user.id
                    )
                    if (!hand) return
                    const drawCardButton = new DrawCards()
                    const sortCardButton = new SortCards()
                    const shuffleHandCardButton = new ShuffleCards()
                    const backButton = new Back()
                    drawCardButton.onClick(this, interaction)
                    sortCardButton.onClick(this, interaction)
                    shuffleHandCardButton.onClick(this, interaction)
                    backButton.onClick(this, interaction)
                    hand.onClickCards(this, interaction)
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    join(user: User, isMaster = false) {
        if (isMaster) {
            this._master = new Hand(user, true)
            this._hands.push(this._master)
        } else {
            const newHand = new Hand(user, false)
            this._hands.push(newHand)
        }
    }

    async start() {
        this.deck = new Deck(this.hands)
        this.deck.distributeCards()
        await this.botMessage.edit(await this.getPlayingGameMessage())
    }
    async stop() {
        this.gameManager.explodingKittenGames =
            this.gameManager.explodingKittenGames.filter((g) => g.id != this.id)
        this.buttonCollector.stop()
    }

    async leave(id: string) {
        const hand = this._hands.find((h) => h.info.id == id)
        if (!hand) return
        if (this._turn == this._hands.length - 1) {
            this._turn = 0
        }
        this._hands = this._hands.filter((h) => h.info.id != id)
        this.updateEntireHandMesssage()
        hand.interaction.editReply(this.getHandMessage(hand))
        if (this.hands.length == 1) {
            const winner = this._hands[0]
            if (!winner) return
            this.updateGeneralMessage(
                winner.info.username + ' won the game'
            )
            if (this._hands[0].interaction) {
                const embed = this.getHandEmbed(winner)
                embed.setTitle('You won the game')
                await this._hands[0].interaction.editReply({ components: [], embeds: [embed] })
            }
        }
        
    }

    updateEntireHandMesssage() {
        for (const hand of this.hands) {
            if (hand.interaction) {
                hand.interaction.editReply(this.getHandMessage(hand))
            }
        }
    }
    async updateGeneralMessage(description: string, thumbnail?: string) {
        if (this.botMessage)
            await this.botMessage.edit(
                await this.getPlayingGameMessage(description, thumbnail)
            )
    }
    dropCard(hand: Hand, cards: Card[], isUpdateGUI = true) {
        for (const card of cards) {
            hand.removeCard(card)
            this.deck.pushToDroppedCards(card)
        }
        if (isUpdateGUI) {
            if (hand.interaction) {
                hand.interaction.editReply({
                    components: this.getHandButtons(hand),
                })
            }
        }
    }
    passTurn() {
        if (this._currentDrawCard <= 0) {
            this._turn++
            if (this._turn >= this.hands.length) this._turn = 0
            this._currentDrawCard = 1
            this.updateEntireHandMesssage()
        }
    }

    setCurrentDrawCard(number: number) {
        this._currentDrawCard = number
    }

    getCurrentDrawCard() {
        return this._currentDrawCard
    }
    public get hands() {
        return this._hands
    }
    public get turn() {
        return this._turn
    }
    public get master() {
        return this._master
    }
    public get message() {
        return this._message
    }
    public get botMessage() {
        return this._botMessage
    }
    public get buttonCollector() {
        return this._buttonCollector
    }
    public get gameManager() {
        return this._gameManager
    }
    public get userManager() {
        return this._userManager
    }
}

// public async getAttachments(numOfCards: number) {
//     let height = 250
//     let width = 130
//     const canvas = Canvas.createCanvas(
//         width * numOfCards + (numOfCards - 1) * 5,
//         height
//     )
//     const ctx = canvas.getContext('2d')
//     const img1 = await Canvas.loadImage(
//         path.join(__dirname, './assets/Attack/BackHair.png')
//     )
//     //const img2 = await Canvas.loadImage('./assets/Attack/BearODacktyl.png')
//     for (let i = 0; i < numOfCards; i++) {
//         if (i == 0) {
//             ctx.drawImage(img1, i, 0, width, height)
//         } else {
//             ctx.drawImage(img1, i * width + 5 * i, 0, width, height)
//         }
//     }
//     return [new MessageAttachment(canvas.toBuffer())]
// }
