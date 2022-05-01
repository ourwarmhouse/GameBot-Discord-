import Music from '..'
import Command from '../../../Command'

export abstract class MusicCommand extends Command {
    constructor(protected _music: Music) {
        super()
        this._name = 'music'
        this._alias = 'm'
    }
}
