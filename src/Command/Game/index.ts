import {ComamndManager} from '..'
import Help from './commands/help'

export default class Game extends ComamndManager {
    constructor() {
        super()
        this._helpCommand = new Help(this)
        this._commands = this._commands.concat([this._helpCommand])
    }
}
