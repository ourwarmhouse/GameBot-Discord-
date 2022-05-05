import UserManager from '../User'
import {ComamndManager} from '..'
import BlackJack from './commands/blackjack'
import Help from './commands/help'

export default class Game extends ComamndManager {
    protected _userManager: UserManager
    constructor(userManager: UserManager) {
        super()
        this._userManager = userManager
        this._helpCommand = new Help(this)
        this._commands = this._commands.concat([
            this._helpCommand,
            new BlackJack(this),
        ])
    }
    public get userManager() {
        return this._userManager
    }
}
