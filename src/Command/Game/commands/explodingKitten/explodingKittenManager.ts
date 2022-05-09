import Canvas from 'canvas'
import {
    CacheType,
    InteractionCollector,
    Message,
    MessageActionRow,
    MessageAttachment,
    MessageComponentInteraction,
    MessageEmbed,
    User
} from 'discord.js'
import MessageHandler from 'Handler/message'
import path from 'path'
import { uid } from 'uid'
import GameManager from '../../../Game'
import UserManager from '../../../User'
import { Destroy } from './buttons/destroy'
import { Join } from './buttons/join'
import { Leave } from './buttons/leave'
import { Start } from './buttons/start'
import { Hand } from './gameObjects/hand'
import { State } from './gameObjects/state'

export default class ExplodingKittenManager {
    public id: string
    public _hands: Hand[]
    private _master!: Hand
    private _userManager: UserManager
    private _botMessage!: Message
    private _buttonCollector!: InteractionCollector<
        MessageComponentInteraction<CacheType>
    >
    private _state!: State

    private getMasterButtonRow() {
        const startButton = new Start().getComponent()
        const destroyButton = new Destroy().getComponent()
        return new MessageActionRow().addComponents(startButton, destroyButton)
    }
    private getMemberButtonRow() {
        const joinButton = new Join().getComponent()
        const leaveButton = new Leave().getComponent()
        return new MessageActionRow().addComponents(joinButton, leaveButton)
    }

    // public state: State
    constructor(
        private _messageHandler: MessageHandler,
        private _message: Message<boolean>,
        private _gameManager: GameManager,
        private _betNumber: number
    ) {
        this.id = uid()
        this._hands = []
        this._userManager = _gameManager.userManager
    }
    public async getAttachments(numOfCards: number) {
        let height = 250
        let width = 130
        const canvas = Canvas.createCanvas(
            width * numOfCards + (numOfCards - 1) * 5,
            height
        )
        const ctx = canvas.getContext('2d')
        const img1 = await Canvas.loadImage(
            path.join(__dirname, './assets/Attack/BackHair.png')
        )
        //const img2 = await Canvas.loadImage('./assets/Attack/BearODacktyl.png')
        for (let i = 0; i < numOfCards; i++) {
            if (i == 0) {
                ctx.drawImage(img1, i, 0, width, height)
            } else {
                ctx.drawImage(img1, i * width + 5 * i, 0, width, height)
            }
        }
        return [new MessageAttachment(canvas.toBuffer())]
    }
    public async getInitGameMessage() {
        const attachments = await this.getAttachments(5)
        const {username, defaultAvatarURL} = this._message.author
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

        return {
            embeds: [embed],
            files: attachments,
            components: [this.getMasterButtonRow(), this.getMemberButtonRow()],
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

            this._buttonCollector.on('collect', async (interaction) => {
                startButton.onClick(this, interaction)
                joinButton.onClick(this, interaction)
                destroyButton.onClick(this, interaction)
                leaveButton.onClick(this, interaction)
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
    start() {}
    leave(id: string) {
        this._hands = this._hands.filter((h) => h.info.id != id)
    }
    public get hands() {
        return this._hands
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
