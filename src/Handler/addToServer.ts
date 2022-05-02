import Constant from '../Constant'
import {Client} from 'discord.js'
import Handler from '.'

export default class AddToServer extends Handler {
    constructor(client: Client) {
        super(client)
    }

    public handle(): void {
        this.client.on('guildCreate', async (guild) => {
            console.log("Add to new server: " + guild.name)
        })
    }
}
