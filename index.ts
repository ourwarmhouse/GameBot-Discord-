import Database from './src/Database'
import {Client, Intents} from 'discord.js'
import dotenv from 'dotenv'
import Message from './src/Handler/message'
import Ready from './src/Handler/ready'
import AddToServer from './src/Handler/addToServer'
import {keepAliver} from './keepAliver'

const main = async () => {
    dotenv.config()
    await Database.connect()
    const client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_VOICE_STATES,
            // Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        ],
    })
    client.login(process.env.DISCORD_TOKEN)
    const readyHandler = new Ready(client)
    const messageHandler = new Message(client)
    const addToServerHandler = new AddToServer(client)

    readyHandler.handle()
    addToServerHandler.handle()
    messageHandler.handle()
}

keepAliver()
main()
