/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/**
 * @Author: Iven Beck
 * @Date:   2019-05-26T21:04:13+02:00
 * @Email:  ivenbeck@outlook.de
 * @Last modified by:   Iven Beck
 * @Last modified time: 2019-09-07T23:50:01+02:00
 */


const YTDL = require('ytdl-core');

const queue = {};
let info = {};

/*
{
  GUILDID: [
    video_urls,
    ...
  ]
}
*/

// TODO: Add a fn that checks for empty vc every 5-10 s to reduce res drain

/* jshint ignore:start */ // because it cant handle async/await

function addEndListener(dispatcher, connection, msg) {
  dispatcher.once('end', () => {
    info = info.slice(1, info.length);
    if (queue[msg.guild.id][0]) {
      dispatcher = connection.playStream(YTDL(queue[msg.guild.id].shift(), {
        filter: 'audioonly',
        highWaterMark: 6000000,
      }));
      addEndListener(dispatcher, connection, msg);
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
      if (!info[msg.guild.id]) info[msg.guild.id] = [];
      if (queue[msg.guild.id].length >= 20) {
        await msg.reply('The max playlist length of this server has been reached.');
        return;
      }
      queue[msg.guild.id].push(args[1]);

      await YTDL.getBasicInfo(args[1], (err, currinfo) => {
        info[msg.guild.id].push({
          author: currinfo.author.name,
          title: currinfo.title,
        });
      });

      msg.reply(`Your track is number \`${queue[msg.guild.id].length}\` in queue!`);

      if (!msg.guild.voiceConnection) {
        msg.member.voiceChannel.join()
          .catch((e) => msg.reply(e))
          .then((connection) => {
            const dispatcher = connection.playStream(YTDL(queue[msg.guild.id].shift(), {
              filter: 'audioonly',
              highWaterMark: 6000000,
            }));
            info[msg.guild.id].shift();
            addEndListener(dispatcher, connection, msg);
          });
      }
      break;

    case 'queue':
    case 'q':

      if (queue[msg.guild.id]) {
        let formattedQueue = '';
        for (let i = 0; i < info[msg.guild.id].length; i++) {
          // needs to be improved!
          // eslint-disable-next-line no-await-in-loop
          let {
            title,
            author,
          } = info[msg.guild.id][i];

          if (title.length > 100) {
            title = title.substr(0, 97);
            title += '...';
          }
          if (author.length > 30) {
            author = author.substr(0, 27);
            author += '...';
          }

          const count = 100 - title.length;
          let num;
          if (i <= 16) {
            num = `0${i.toString(16)}`;
          } else {
            num = i.toString(16);
          }

          formattedQueue += `${num}: ${title}${' '.repeat(count)} by ${author}\n`;
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
