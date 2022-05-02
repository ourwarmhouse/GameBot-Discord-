import Constant from '../Constant'
import {Client} from 'discord.js'
import Handler from '.'

export default class Ready extends Handler {
    constructor(client: Client) {
        super(client)
    }

    public handle(): void {
        this.client.once('ready', () => {
            this.client.user?.setActivity(Constant.prefix + `help`)
            console.log('🎆 Ready !!')
        })
    }
}
