import {Client, Intents} from 'discord.js'
import dotenv from 'dotenv'
import Message from './src/Handler/message'
import Ready from './src/Handler/ready'

const main = async () => {
    dotenv.config()
    const client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_VOICE_STATES,
        ],
    })
    client.login(process.env.DISCORD_TOKEN)
    const readyHandler = new Ready(client)
    const messageHanlder = new Message(client)
    readyHandler.handle()

    messageHanlder.handle()
}

main()