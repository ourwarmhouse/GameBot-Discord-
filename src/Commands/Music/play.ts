import MessageHandler from "Handler/message";
import youtube from "youtube-search";
import Music from ".";
import { Message, MessageEmbed } from "discord.js";
import {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    generateDependencyReport,
} from "@discordjs/voice";
import ytdl from "ytdl-core";

export class Play extends Music {
    constructor() {
        super();
        this._name = this._name + " play";
        this._alias = this._alias + " p";
    }

    async execute(messageHandler: MessageHandler, message: Message) {
        const opts = {
            maxResults: 5,
            key: process.env.YOUTUBE_KEY,
        };
        try {
            const { results } = await youtube(
                messageHandler.commandArgs.join(" "),
                opts
            );
            const embeds = results.map((r, idx) =>
                new MessageEmbed()
                    .setTitle(`${idx + 1}. ${r.title}`)
                    .setURL(r.link)
                    .setThumbnail((r.thumbnails.default?.url as string) || "")
            );
            message.channel.send({ content: "List result", embeds });
            const collector = message.channel.createMessageCollector({
                filter: (user) => user.author.id === message.author.id,
                max: 1,
                time: 15000,
            });

            collector.on("collect", async (msg) => {
                if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(parseInt(msg.content))) {
                    message.channel.send("Not an option or a number!");
                    return;
                }
                if (!message.member?.voice.channelId) {
                    message.channel.send("Please join a voice channel to use this!");
                }

                if (
                    !message.guild ||
                    !message.member ||
                    !message.guild.voiceAdapterCreator
                ) {
                    message.channel.send("Please try again!");
                    return;
                }
                const stream = ytdl(
                    `https://youtube.com?v=${results[Number(msg.content) - 1].id}`,
                    { filter: "audioonly" }
                );
                console.log(`https://youtube.com?v=${results[Number(msg.content) - 1].id}`)
                const player = createAudioPlayer();
                const resource = createAudioResource(stream);
                resource.volume?.setVolume(1)
                const connection = joinVoiceChannel({
                    channelId: message.member.voice.channel?.id || "",
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator as any,
                });

                connection.subscribe(player);
                player.play(resource);

                // player.on(AudioPlayerStatus.Idle, () => {
                //     connection.destroy();
                // });
            });
        } catch (e) {
            console.log(e);
        }
    }

    public help(): void { }
}
