import User from '..'
import Command from '../../../Command'

export abstract class UserCommand extends Command {
    constructor(protected _userManager: User) {
        super()
        this._name = 'user'
        this._alias = 'u'
    }
}
