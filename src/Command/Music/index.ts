import {
    AudioPlayerStatus,
    createAudioPlayer,
    VoiceConnection,
    VoiceConnectionStatus,
} from '@discordjs/voice'
import {Message} from 'discord.js'
import Command from '..'
import PlayCommand from './commands/play'
import QueueCommand from './commands/queue'
import RepeatCommand from './commands/repeat'
import SkipCommand from './commands/skip'
import MusicQueue from './queue'
import AudioState from './states/audio'
import AudioIdle from './states/audio/idle'
import AudioPlaying from './states/audio/playing'
import ConnectionState from './states/connection'
import Disconnect from './states/connection/disconnect'

export default class Music {
    protected _audioState!: AudioState 
    protected _connectionState!: ConnectionState
    private _commands: Command[] = []
    public player = createAudioPlayer()
    public connection!: VoiceConnection

    public queue: MusicQueue

    constructor() {
        this._commands = this._commands.concat([
            new PlayCommand(this),
            new QueueCommand(this),
            new RepeatCommand(this),
            new SkipCommand(this)
        ])
        this.changeConnectionState(new Disconnect())
        this.changeAudioState(new AudioIdle())
        this.queue = new MusicQueue()
        this.player.on(AudioPlayerStatus.Idle, (oldState,newState) => {
            if (oldState.status == 'playing' && newState.status == 'idle') {
                const oldSong = this.queue.current.shift()
                if (this.queue.isRepeating && oldSong)
                    this.queue.current.push(oldSong)
                
                this.changeAudioState(new AudioIdle())
                this._audioState.play()
            }
            
        })
        this.player.on(AudioPlayerStatus.Playing, () => {
            this.changeAudioState(new AudioPlaying())
        })
    }

    public changeAudioState(state: AudioState) {
        this._audioState = state
        this._audioState.setMusic(this)
    }
    public changeConnectionState(state: ConnectionState) {
        this._connectionState = state
        this._connectionState.setMusic(this)
    }

    public clickPlay(message: Message) {
        if (
            !this.connection ||
            this.connection.state.status == 'disconnected' ||
            this.connection.state.status == 'destroyed'
        )
            if (this._connectionState.connect(message))
                this._audioState.play()
        else
            this._audioState.play()    
    }

    public clickSkip() {}

    public clickQueue() {}

    public clickPause() {}

    public clickResume() {}

    public get commands() {
        return this._commands
    }
}
