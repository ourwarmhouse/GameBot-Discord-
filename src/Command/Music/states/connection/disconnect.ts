import State from '.'

export default class Disconnect extends State {
    override disconnect(): boolean {
        if (!this._music.connection) return false
        this._music.connection.disconnect()
        this._music.textChannelList.forEach((c) =>
            c.send('I have no reason to exist 😥')
        )
        return true
    }
}
