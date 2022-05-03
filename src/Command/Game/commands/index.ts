import Game from '..'
import Command from '../../../Command'

export abstract class GameCommand extends Command {
    constructor(protected _gameManager: Game) {
        super()
        this._name = 'game'
        this._alias = 'g'
    }
}
