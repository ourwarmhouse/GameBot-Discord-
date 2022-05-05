import {joinVoiceChannel} from '@discordjs/voice'
import {Message} from 'discord.js'
import State from '.'
import Disconnect from './disconnect'
import Ready from './ready'

export default class Connecting extends State {
    override connect(message: Message<boolean>) {
        //validate channel
        if (
            !message.guild ||
            !message.member ||
            !message.guild.voiceAdapterCreator
        ) {
            message.channel.send('Please try again!')
            this._music.changeConnectionState(new Disconnect())
            return
        }
        if (!message.member.voice.channel) {
            message.reply('Please join a voice channel to use this!')
            this._music.changeConnectionState(new Disconnect())
            return
        }
        //push channels which user call bot
        if (
            !this._music.textChannelList.find((c) => c.id == message.channel.id)
        ) {
            this._music.textChannelList.push(message.channel)
        }

        //set current voice channel if haven't yet or user want to chose another voice channel
        const {channel} = message.member.voice
        if (
            !this._music.currentVoiceChannel ||
            channel.id != this._music.currentVoiceChannel.id
        ) {
            this._music.setCurrentVoiceChannel(channel)
            this._music.connection = joinVoiceChannel({
                channelId: channel.id || '',
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator as any,
            })
            this._music.changeConnectionState(new Ready())
            return
        }

        const {status} = this._music.connection.state
        if (status == 'disconnected' || status == 'destroyed') {
            this._music.connection = joinVoiceChannel({
                channelId: channel.id || '',
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator as any,
            })
            this._music.changeConnectionState(new Ready())
            return
        }
        this._music.changeConnectionState(new Disconnect())
    }
}
