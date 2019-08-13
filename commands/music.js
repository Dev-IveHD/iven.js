/* eslint-disable no-param-reassign */
/**
 * @Author: Iven Beck
 * @Date:   2019-05-26T21:04:13+02:00
 * @Email:  ivenbeck@outlook.de
 * @Last modified by:   Iven Beck
 * @Last modified time: 2019-08-07T20:18:10+02:00
 */


const YTDL = require('ytdl-core');

const queue = {};

/* Should look like:
{
  GUILDID: [
    video_urls...
  ]
}
*/

// TODO: Add a fn that checks for empty vc every 5-10 s to reduce res drain
// TODO: Make songdetails a parallel Array and fetch Info when track is being added not on request
// TODO: Add max queue length

/* jshint ignore:start */ // because it cant handle async/await

function addEndListener(dispatcher, connection, msg) {
  dispatcher.once('end', () => {
    if (queue[msg.guild.id][0]) {
      dispatcher = connection.playStream(YTDL(queue[msg.guild.id].shift(), {
        filter: 'audioonly',
      }));
      addEndListener(dispatcher, connection);
    } else {
      connection.disconnect();
    }
  });
}

module.exports.run = async (client, msg, args) => {
  if (!args[0]) return;

  switch (args[0]) {
    case 'play':
    case 'p':

      if (!args[1]) return;
      if (!msg.member.voiceChannel) return;
      if (!YTDL.validateURL(args[1])) return;

      if (!queue[msg.guild.id]) queue[msg.guild.id] = [];
      queue[msg.guild.id].push(args[1]);
      msg.reply(`Your track is number \`${queue[msg.guild.id].length}\` in queue!`);

      if (!msg.guild.voiceConnection) {
        msg.member.voiceChannel.join()
          .catch((e) => msg.reply(e))
          .then((connection) => {
            const dispatcher = connection.playStream(YTDL(queue[msg.guild.id].shift(), {
              filter: 'audioonly',
              highWaterMark: 60000000,
            }));
            addEndListener(dispatcher, connection, msg);
          });
      }
      break;

    case 'queue':
    case 'q':

      if (queue[msg.guild.id]) {
        const rawQueue = queue[msg.guild.id];
        let formattedQueue = '';

        for (let i = 0; i < rawQueue.length; i + 1) {
          // needs to be improved!
          // eslint-disable-next-line no-await-in-loop
          const songInfo = await YTDL.getInfo(rawQueue[i]);
          let {
            title,
          } = songInfo.player_response.videoDetails;
          let {
            author,
          } = songInfo.player_response.videoDetails;

          if (title.length > 60) {
            title = title.substr(0, 60);
            title += '...';
          }

          if (author.length > 20) {
            author = author.substr(0, 20);
            author += '...';
          }

          formattedQueue += `${i.toString(16)}: ${title} by ${author}\n`;
        }

        if (formattedQueue.length > 2000) {
          formattedQueue = formattedQueue.substr(0, 1950);
          formattedQueue += '...';
        }

        msg.reply(`\`\`\`${formattedQueue}\`\`\``);
      } else {
        msg.reply('Queue is empty');
      }
      break;

    default:
      msg.reply('Unknown subcommand');
  }
};
/* jshint ignore:end */


module.exports.help = {
  name: 'music',
  description: 'Plays a song in the current voicechannel',
  perms: '',
  syntax: 'music {link} [volume]',
};
