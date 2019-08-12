/**
 * @Author: Iven Beck
 * @Date:   2019-05-26T21:04:13+02:00
 * @Email:  ivenbeck@outlook.de
 * @Last modified by:   Iven Beck
 * @Last modified time: 2019-08-07T20:18:10+02:00
 */


const discord = require("discord.js");
const YTDL = require('ytdl-core');

let queue = {};

/* Should look like:
{
  GUILDID: [
    video_urls...
  ]
}
*/

// TODO: Add a fn that checks for empty vc every 5-10 s to reduce res drain
// TODO: Make songdetails a parallel Array and fetch Info when track is being added not on request

/* jshint ignore:start */ //because it cant handle async/await
module.exports.run = async (client, msg, args) => {
  if (!args[0]) return;

  switch (args[0]) {
    case "play":
    case "p":

      if (!args[1]) return;
      if (!msg.member.voiceChannel) return;
      if (!YTDL.validateURL(args[1])) return;

      if (!queue[msg.guild.id]) queue[msg.guild.id] = [];
      queue[msg.guild.id].push(args[1]);
      msg.reply("Your track is number `" + (queue[msg.guild.id].length) + "` in queue!");


      if (!msg.guild.voiceConnection) msg.member.voiceChannel.join()
        .catch(e => msg.reply(e))
        .then(connection => {
          let dispatcher = connection.playStream(YTDL(queue[msg.guild.id].shift(), {
            filter: "audioonly",
            highWaterMark: 1 << 26
          }));
          addEndListener(dispatcher, connection);
        });
      break;

    case "queue":
    case "q":

      let splitQueue = queue[msg.guild.id] ? queue[msg.guild.id].toString()
        .split(",") : null;

      if (queue[msg.guild.id]) {

        let rawQueue = queue[msg.guild.id];
        let formattedQueue = "";

        for (var i = 0; i < rawQueue.length; i++) {
          let songInfo = await YTDL.getInfo(rawQueue[i]);
          let title = songInfo.player_response.videoDetails.title;
          let author = songInfo.player_response.videoDetails.author;

          if (title.length > 60) {
            title = title.substr(0, 60);
            title += "...";
          }

          if (author.length > 20) {
            author = author.substr(0, 20);
            author += "...";
          }

          formattedQueue += `${i}: ${title} by ${author}\n`;
        };

        msg.reply("```" + formattedQueue + "```");
      } else {
        msg.reply('Queue is empty');
      }
      break;

    default:
      msg.reply("Unknown subcommand");

  }
  addEndListener = (dispatcher, connection) => {
    dispatcher.once('end', () => {
      if (queue[msg.guild.id][0]) {
        dispatcher = connection.playStream(YTDL(queue[msg.guild.id].shift(), {
          filter: "audioonly"
        }));
        addEndListener(dispatcher, connection);
      } else {
        connection.disconnect();
      }
    });
  };
};
/* jshint ignore:end */
/*
module.exports.run = (client, msg, args) => {
  if (!args[0]) return;
  if (!YTDL.validateURL(args[0])) return;
  if (!msg.member.voiceChannel) return;
  if (!msg.member.guild.voiceConnection) msg.member.voiceChannel.join()
    .catch(e => console.log(e))
    .then(function(connection) {
      dp = mf.play(client, connection, args[0]);
      if (args[1]) {
        dp.setVolume(parseFloat(args[1]));
      }
      client.once('musicend', () => {
        connection.disconnect();
      });
    });

};
*/

module.exports.help = {
  name: "music",
  description: "Plays a song in the current voicechannel",
  perms: "",
  syntax: "music {link} [volume]"
};
