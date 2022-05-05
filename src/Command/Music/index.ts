import {
    AudioPlayerStatus,
    AudioResource,
    createAudioPlayer,
    VoiceConnection,
} from '@discordjs/voice'
import {Message, TextBasedChannel, VoiceBasedChannel} from 'discord.js'
import {ComamndManager} from '..'
import HelpCommand from './commands/help'
import LeaveCommand from './commands/leave'
import NowPlayingCommand from './commands/nowplaying'
import PlayCommand from './commands/play'
import QueueCommand from './commands/queue'
import RepeatCommand from './commands/repeat'
import SkipCommand from './commands/skip'
import DeleteCommand from './commands/delete'
import MusicQueue from './queue'
import AudioState from './states/audio'
import AudioIdle from './states/audio/idle'
import ConnectionState from './states/connection'
import Connecting from './states/connection/connecting'
import Disconnect from './states/connection/disconnect'
import Ready from './states/connection/ready'
import UserManager from '../User'

export default class Music extends ComamndManager {
    protected _userManager: UserManager
    protected _audioState!: AudioState
    public player = createAudioPlayer()
    public queue: MusicQueue
    private _currentResource!: AudioResource
    protected _connectionState!: ConnectionState
    public connection!: VoiceConnection

    private _currentVoiceChannel!: VoiceBasedChannel
    private _textChannelList: TextBasedChannel[] = []

    constructor(userManager: UserManager) {
        super()
        this._userManager = userManager
        this._helpCommand = new HelpCommand(this)
        this._commands = this._commands.concat([
            new PlayCommand(this),
            new QueueCommand(this),
            new RepeatCommand(this),
            new SkipCommand(this),
            new NowPlayingCommand(this),
            new LeaveCommand(this),
            new DeleteCommand(this),
            this._helpCommand,
        ])
        this.changeConnectionState(new Disconnect())
        this.changeAudioState(new AudioIdle())
        this.queue = new MusicQueue()
        this.player.on(AudioPlayerStatus.Idle, (oldState, newState) => {
            if (oldState.status == 'playing' && newState.status == 'idle') {
                const oldSong = this.queue.current.shift()
                if (oldSong) {
                    if (this.queue.isRepeating) this.queue.current.push(oldSong)
                    this.changeAudioState(new AudioIdle())
                    this._audioState.play()
                } else {
                    this.changeConnectionState(new Disconnect())
                    this._connectionState.disconnect()
                }
            }
        })
    }

    public clickConnect(message: Message) {
        this.changeConnectionState(new Connecting())
        this._connectionState.connect(message)
    }

    public clickPlay(message: Message) {
        this.clickConnect(message)
        //play audio if connect is established
        if (this._connectionState.isConnect) {
            if (this._connectionState.subscribeAudio()) this._audioState.play()
        }
    }

    public clickSkip() {
        this.player.stop()
    }

    public clickLeave() {
        this.changeConnectionState(new Disconnect())
        this.connectionState.disconnect()
    }

    public clickQueue() {}

    public clickPause() {}

    public clickResume() {}

    public changeAudioState(state: AudioState) {
        this._audioState = state
        this._audioState.setMusic(this)
    }
    public changeConnectionState(state: ConnectionState) {
        this._connectionState = state
        this._connectionState.setMusic(this)
    }
    public get currentVoiceChannel() {
        return this._currentVoiceChannel
    }
    public setCurrentVoiceChannel(newChannel: VoiceBasedChannel) {
        this._currentVoiceChannel = newChannel
    }
    public get textChannelList() {
        return this._textChannelList
    }
    public get connectionState() {
        return this._connectionState
    }
    public get currentResource() {
        return this._currentResource
    }
    public get userManager() {
        return this._userManager
    }
    public setCurrentResource(newResource: AudioResource) {
        this._currentResource = newResource
    }
}
