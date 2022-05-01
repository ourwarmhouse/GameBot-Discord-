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

    public get current() {
        return this._queue
    }
    public get isRepeating() { return this._isRepeating }
    public repeat() { this._isRepeating = true }
    
}
