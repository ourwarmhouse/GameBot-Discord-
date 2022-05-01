import State from '.'
import Ready from './ready'

export default class Connected extends State {
    public play(): void {
        this._music.connection.subscribe(this._music.player)
        this._music.changeConnectionState(new Ready())
    }
}
