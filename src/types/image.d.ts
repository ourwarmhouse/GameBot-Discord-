import {Message} from 'discord.js'

declare module '*.png' {
    const value: any
    export = value
}
declare module '*.jpg'
declare module '*.gif'

declare module '*.mp3'

// declare module 'discord-blackjack' {
//     function blackjack(message:Message, config?:{}): Promise<{ result: 'WIN' | 'LOSE' }>
//     namespace blackjack { }
//     export = blackjack
// }
