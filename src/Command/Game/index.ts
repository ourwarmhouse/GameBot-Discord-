import UserManager from '../User'
import {ComamndManager} from '..'
import BlackJack from './commands/blackjack'
import ExplodingKitten from './commands/explodingKitten'
import Help from './commands/help'
import ExplodingKittenManager from './commands/explodingKitten/ekManager'
import BlackJackManager from './commands/blackjack/blackjackManager'

export default class Game extends ComamndManager {
    protected _userManager: UserManager
    protected _explodingKittenGames: ExplodingKittenManager[] = []
    public blackJackGames: BlackJackManager[] = []
    constructor(userManager: UserManager) {
        super()
        this._userManager = userManager
        this._helpCommand = new Help(this)
        this._commands = this._commands.concat([
            this._helpCommand,
            new BlackJack(this),
            new ExplodingKitten(this),
        ])
    }
    public get userManager() {
        return this._userManager
    }
    public get explodingKittenGames() {
        return this._explodingKittenGames
    }
}
