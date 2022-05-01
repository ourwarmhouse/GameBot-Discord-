import Music from '..'

export default class State {
    protected _music!: Music
    public setMusic(music: Music) {
        this._music = music
    }
}
