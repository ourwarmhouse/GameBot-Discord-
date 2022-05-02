import Command from 'Command'
import Music from '../Command/Music'
import User from '../Command/User'
import {Client, Collection} from 'discord.js'
import Handler from '.'
import Constant from '../Constant'
import Help from '../Command/help'

export default class Message extends Handler {
    private _commands = new Collection<string, Command>()
    private _aliases = new Collection<string, string>()
    public commandArgs: string[] = []

    constructor(client: Client) {
        super(client)
        const music = new Music()
        music.commands.forEach(c => this.addCommand(c))
        const user = new User()
        user.commands.forEach(c => this.addCommand(c))

        const helpCommand = new Help()
            .addField({ title: 'Music', content: music.helpCommand.getHelpString() })
        
        this.addCommand(helpCommand)
    }
    public handle() {
        this.client.on('messageCreate', (message) => {
            if (!message.content.startsWith(Constant.prefix)) return
            const commands = message.content
                .slice(Constant.prefix.length)
                .split(' ')
            
            //command one character
            let command = commands.shift()
            const args = commands

            if (!command) return

            const aliasToCommand = this._aliases.get(command)
            
            let commandFromCollection = aliasToCommand
                ? this._commands.get(aliasToCommand)
                : this._commands.get(command)
            this.commandArgs = args
            

            if (!commandFromCollection) {
                //command two character
                command += ' ' + commands.shift()
                const args = commands

                if (!command) return

                const aliasToCommand = this._aliases.get(command)
                
                commandFromCollection = aliasToCommand
                    ? this._commands.get(aliasToCommand)
                    : this._commands.get(command)
                this.commandArgs = args
                
            }

            if (!commandFromCollection) return

            try {
                commandFromCollection.execute(this, message)
            } catch (e) {
                console.log(e)
                message.channel.send('Fail to execute this command')
            }
        })
    }

    public addCommand(command: Command) {
        this._commands.set(command.name, command)
        this._aliases.set(command.alias, command.name)
    }
}
