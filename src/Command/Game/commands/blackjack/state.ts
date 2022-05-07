import {inlineCode, italic} from '@discordjs/builders'
import currency from 'currency.js'
import {
    ColorResolvable,
    Message,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    ReplyMessageOptions,
} from 'discord.js'
import Constant from '../../../../Constant'
import {Deck, Hand} from './objects'

export enum GameResult {
    TimeUp = -2,
    Lost = -1,
    Running = 0,
    Won = 1,
    Tie = 2,
    BlackJack = 3,
}

export class GameState {
    private _deck: Deck
    private _dealerHand: Hand
    private _playerHand: Hand
    /**
     * -2 - Time-up
     * -1 - Lost
     * 0 - Default (Game is running)
     * 1 - Won
     * 2 - Tie
     * 3 - BlackJack
     **/
    private _result = GameResult.Running
    private _overtime = Constant.SECOND * 60

    private _timestamp = Date.now() // game starting time

    private _actionButtonHit: MessageButton
    private _actionButtonStand: MessageButton

    constructor(private _message: Message, private _bet: number, deck: Deck) {
        this._deck = deck
        this._dealerHand = new Hand(this._deck.draw(), this._deck.draw(true))
        this._playerHand = new Hand(this._deck.draw(), this._deck.draw())

        this._actionButtonHit = new MessageButton()
            .setEmoji('✅')
            .setLabel('Hit')
            .setStyle(3)
            .setCustomId('hit')

        this._actionButtonStand = new MessageButton()
            .setEmoji('🛑')
            .setStyle(4)
            .setLabel('Stand')
            .setCustomId('stand')

        // check for player blackjack
        if (this._playerHand.getValue() == 21) {
            this._dealerHand.cards[1].isHidden = false
            this._result = GameResult.BlackJack
        } else if (this._dealerHand.getValue() == 21) {
            this._dealerHand.cards[1].isHidden = false
            this._result = GameResult.Lost
        }
    }

    public isOver(): boolean {
        return this._result != GameResult.Running
    }
    public isOverTime() {
        console.log(
            Date.now() - this._timestamp > this._overtime,
            Date.now() - this._timestamp
        )
        return Date.now() - this._timestamp > this._overtime
    }

    public getEmbed(): MessageEmbed {
        try {
            const dollar = currency(this._bet).format()
            const {username, defaultAvatarURL} = this._message.author
            const userAvatar = (
                this._message.author.avatarURL()
                    ? this._message.author.avatarURL()
                    : defaultAvatarURL
            ) as string
            const remind =
                italic(
                    `Response within ${this._overtime / Constant.SECOND}s or `
                ) + inlineCode('-' + dollar)
            let color: ColorResolvable = 'GREY'

            const message = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle('BlackJack')
                .setURL('http://www.hitorstand.net/strategy.php')
                .addField('Dealer Hand', this._dealerHand.print())
                .addField('Player Hand', this._playerHand.print())
                .setAuthor({
                    name: username + ' bet ' + dollar,
                    iconURL: userAvatar,
                })

            if (this._result != GameResult.Running) {
                this._actionButtonHit.setDisabled(true)
                this._actionButtonStand.setDisabled(true)
            }

            // Image for win, lose, tie, and blackjack
            if (this._result == GameResult.Won) {
                color = 'GREEN'
                message.setFooter({text: 'You won ' + dollar})
            } else if (this._result == GameResult.Lost) {
                color = 'RED'
                message.setFooter({text: 'You lost ' + dollar})
            } else if (this._result == GameResult.Tie) {
                color = 'GREY'
                message.setFooter({text: 'You tied with dealer'})
            } else if (this._result == GameResult.BlackJack) {
                color = 'GREEN'
                message.setFooter({text: 'You won ' + dollar})
            } else if (this._result == GameResult.TimeUp) {
                color = 'RED'
                message.setFooter({text: 'You lost ' + dollar})
            }

            message.setDescription(remind)
            message.setColor(color)

            return message
        } catch (e) {
            console.log(e)
            return new MessageEmbed()
        }
    }

    public getButtons(): MessageActionRow {
        const rowButtons = new MessageActionRow()
            .addComponents(this._actionButtonHit)
            .addComponents(this._actionButtonStand)
        return rowButtons
    }

    public getMessage(): ReplyMessageOptions {
        return {
            embeds: [this.getEmbed()],
            components: [this.getButtons()],
        }
    }

    // player action HIT
    public hit(): void {
        if (!this.isOverTime()) {
            // check for time-up
            this._playerHand.cards.push(this._deck.draw(false))

            // check for player blackjack or bust
            if (this._playerHand.getValue() >= 21) this.stand()
        } else this._result = GameResult.TimeUp
    }

    // player action STAND
    public stand(): void {
        if (!this.isOverTime()) {
            // check for time-up
            // reveal the dealer's second card
            this._dealerHand.cards[1].isHidden = false

            // get a card for dealer
            // AI ver 1
            while (this._dealerHand.getValue() < 16) {
                // dealer hit's in case of value less than 17
                this._dealerHand.cards.push(this._deck.draw(false))
            }

            // check for dealer
            if (
                this._dealerHand.getValue() > 21 &&
                this._playerHand.getValue() > 21
            )
                this._result = GameResult.Tie
            else if (
                this._dealerHand.getValue() > 21 &&
                this._playerHand.getValue() <= 21
            )
                this._result = GameResult.Won
            else if (
                this._dealerHand.getValue() <= 21 &&
                this._playerHand.getValue() > 21
            )
                this._result = GameResult.Lost
            // dealer has bust
            else {
                // dealer has not bust, so compare the player and the dealer
                if (this._playerHand.getValue() > this._dealerHand.getValue())
                    this._result = GameResult.Won
                else if (
                    this._playerHand.getValue() < this._dealerHand.getValue()
                )
                    this._result = GameResult.Lost
                else if (
                    this._playerHand.getValue() == this._dealerHand.getValue()
                )
                    this._result = GameResult.Tie
            }
        } else this._result = GameResult.TimeUp
    }

    public get result() {
        return this._result
    }
}
