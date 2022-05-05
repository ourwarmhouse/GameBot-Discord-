import Command from 'Command'
import Music from '../Command/Music'
import User from '../Command/User'
import {Client, Collection} from 'discord.js'
import Handler from '.'
import Constant from '../Constant'
import Help from '../Command/help'
import Game from '../Command/Game'

export default class Message extends Handler {
    private _commands = new Collection<string, Command>()
    private _aliases = new Collection<string, string>()
    public commandArgs: string[] = []

    constructor(client: Client) {
        super(client)
        const helpCommand = new Help()
        const user = new User()
        const managerList = [user, new Music(user), new Game(user)]
        for (let manager of managerList) {
            manager.commands.forEach((c) => this.addCommand(c))
            helpCommand.addField({
                title: manager.constructor.name,
                content: manager.helpCommand.getHelpString(),
            })
        }
        this.addCommand(helpCommand)
    }
    public handle() {
        this.client.on('messageCreate', (message) => {
            if (!message.content.startsWith(Constant.prefix)) return
            const commands = message.content
                .slice(Constant.prefix.length)
                .split(' ')

            let command
            let commandFromCollection
            let args: string[] = []
            let isFoundCommad = false
            if (commands[0] && commands[1]) {
                console.log(commands[0], commands[1])
                //command two character
                command = commands[0] + ' ' + commands[1]

                if (!command) return

                const aliasToCommand = this._aliases.get(command)

                commandFromCollection = aliasToCommand
                    ? this._commands.get(aliasToCommand)
                    : this._commands.get(command)

                if (commandFromCollection) {
                    args = commands.slice(2)
                    isFoundCommad = true
                }
            }
            if (isFoundCommad == false && commands[0]) {
                console.log(commands[0])

                //command one character
                command = commands[0]

                if (!command) return

                const aliasToCommand = this._aliases.get(command)

                commandFromCollection = aliasToCommand
                    ? this._commands.get(aliasToCommand)
                    : this._commands.get(command)

                if (commandFromCollection) args = commands.slice(1)
            }

            if (!commandFromCollection) return

            try {
                this.commandArgs = args
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
