import { joinVoiceChannel } from '@discordjs/voice'
import {Message} from 'discord.js'
import State from '..'

export default abstract class ConnectionState extends State {
    public connect(message: Message<boolean>): boolean {
        if (
            !message.guild ||
            !message.member ||
            !message.guild.voiceAdapterCreator
        ) {
            message.channel.send('Please try again!')
            return false
        }
        if (!message.member?.voice.channelId) {
            message.reply('Please join a voice channel to use this!')
            return false
        }
        this._music.connection = joinVoiceChannel({
            channelId: message.member.voice.channel?.id || '',
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator as any,
        })
        this._music.connection.subscribe(this._music.player)
        return true
    }
}
