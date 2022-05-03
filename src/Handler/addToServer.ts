import Constant from 'Constant'
import {Client} from 'discord.js'
import Handler from '.'
import Help from 'Command/help'

export default class AddToServer extends Handler {
    constructor(client: Client) {
        super(client)
    }

    public handle(): void {
        this.client.on('guildCreate', async (guild) => {
            // guild.emojis.create()
            console.log('Add to new server: ' + guild.name)
        })
    }
}
