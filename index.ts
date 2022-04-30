
import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
import Message from './src/Handler/message';
import Ready from './src/Handler/ready';
import { Play } from './src/Commands/Music'

const main = async () => {
    dotenv.config()
    const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES] })
    client.login(process.env.DISCORD_TOKEN)
    const readyHandler = new Ready(client)
    const messageHanlder = new Message(client)

    readyHandler.handle()

    messageHanlder.addCommand(new Play())
    messageHanlder.handle()

}

main()