import {Video} from 'youtube-sr'

export type TrackInQueueType = {
    addBy: string
    song: Video
}

export default class MusicQueue {
    public _queue: TrackInQueueType[] = []
    private _isRepeating = false
    public push(addBy: string, track: Video) {
        this._queue.push({addBy, song: track})
    }

    public delete(position: number) {
        if (position >= this._queue.length) this._queue.pop()
        else this._queue = this._queue.filter((_, idx) => idx != position)
    }

    public clear() {
        this._queue = this._queue.slice(0, 1)
    }

    public get current() {
        return this._queue
    }
    public get isRepeating() {
        return this._isRepeating
    }
    public repeat() {
        this._isRepeating = true
    }
}
