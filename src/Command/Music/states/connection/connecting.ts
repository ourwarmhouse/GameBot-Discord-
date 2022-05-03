import {joinVoiceChannel} from '@discordjs/voice'
import {Message} from 'discord.js'
import State from '.'

export default class Connecting extends State {
    override connect(message: Message<boolean>): boolean {
        //validate channel
        console.log('connecting')
        if (
            !message.guild ||
            !message.member ||
            !message.guild.voiceAdapterCreator
        ) {
            message.channel.send('Please try again!')
            return false
        }
        if (!message.member.voice.channel) {
            message.reply('Please join a voice channel to use this!')
            return false
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
            return true
        }

        const {status} = this._music.connection.state
        if (status == 'disconnected' || status == 'destroyed') {
            console.log('rejoin')
            this._music.connection = joinVoiceChannel({
                channelId: channel.id || '',
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator as any,
            })
            return true
        }

        return false
    }
}
