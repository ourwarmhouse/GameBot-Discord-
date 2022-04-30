import Command from "Commands";
import { Client, Collection } from "discord.js";
import Handler from ".";


export default class Message extends Handler {
    private _prefix = '.'
    private _commands = new Collection<string, Command>()
    private _aliases = new Collection<string, string>()
    public commandArgs: string[] = []
    
    constructor(client: Client) {
        super(client)
    }
    public handle() {
        this.client.on('messageCreate', message => {

            if (!message.content.startsWith(this._prefix)) return

            const commands = message.content.slice(1).split(' ')
            let command = commands.shift() + ' ' + commands.shift()
            const args = commands

            if (!command) return

            const aliasToCommand = this._aliases.get(command)
            let commandFromCollection = aliasToCommand ? this._commands.get(aliasToCommand) : this._commands.get(command)
            
            if (!commandFromCollection) return

            this.commandArgs = args

            try {   
                commandFromCollection.execute(this,message)
            }
            catch (e) {
                console.log(e)
                message.channel.send('Fail to execute this command')
            }
        })
    }

    public addCommand(command: Command) {
        this._commands.set(command.name, command)
        this._aliases.set(command.alias, command.name)

        return this
    }
}