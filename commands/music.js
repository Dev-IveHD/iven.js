/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/**
 * @Author: Iven Beck
 * @Date:   2019-05-26T21:04:13+02:00
 * @Email:  ivenbeck@outlook.de
 * @Last modified by:   Iven Beck
 * @Last modified time: 2019-09-07T23:50:01+02:00
 */

const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const queue = new Map();

function subCmdParser(client, message, args) {
  const serverQueue = queue.get(message.guild.id);

  switch (args[0]) {
    case 'p':
    case 'play':
      execute(message, serverQueue);
      break;
    case 'skip':
      skip(message, serverQueue);
      break;
    case 'vol':
    case 'volume':
      setVolume(message, serverQueue, args[1]);
      break;
    case 'stop':
      stop(message, serverQueue);
      break;
    case 'q':
    case 'queue':
      sendQueue(message, serverQueue);
      break;
    default:
      message.channel.send('Invalid command!');
      break;
  }
}

async function sendQueue(message, serverQueue) {
  if (serverQueue) {
    let formattedQueue = '';
    serverQueue.songs.forEach((song, i) => {
      let { title, author } = song;

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
      if (i <= 9) {
        num = `0${i}`;
      } else {
        num = i;
      }

      formattedQueue += `${num}: ${title}${' '.repeat(count)} by ${author}\n`;
    });

    let finalQueue;

    if (formattedQueue.length > 2000) {
      formattedQueue = formattedQueue.substr(0, 1950);
      formattedQueue += '\n...';
    }
    message.channel.send(`\`\`\`${formattedQueue}\`\`\``);
  } else {
    message.reply('Queue is empty');
  }
}

async function setVolume(message, serverQueue, vol) {
  if (serverQueue.connection) {
    try {
      serverQueue.connection.dispatcher.setVolumeLogarithmic(vol / 5);
      serverQueue.volume = vol;
      message.channel.send('Volume set to ' + vol);
    } catch (e) {
      message.channel.send(e);
    }
  } else {
    message.channel.send("Couldn't set volume!");
  }
}

async function execute(message, serverQueue) {
  const args = message.content.split(' ');

  const voiceChannel = message.member.voiceChannel;
  if (!voiceChannel)
    return message.channel.send(
      'You need to be in a voice channel to play music!',
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
    return message.channel.send(
      'I need the permissions to join and speak in your voice channel!',
    );
  }

  const isSingle = ytdl.validateURL(args[2]);
  const isPlaylist = ytpl.validateURL(args[2]);

  if (!isSingle && !isPlaylist) return message.channel.send('Invalid URL');

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };

    queue.set(message.guild.id, queueContruct);
  }

  serverQueue = queue.get(message.guild.id);

  if (isSingle) {
    const songInfo = await ytdl.getInfo(args[2]);
    const song = {
      title: songInfo.title,
      author: songInfo.author.name,
      url: songInfo.video_url,
    };

    serverQueue.songs.push(song);
  }

  if (isPlaylist) {
    const allTracks = await ytpl(args[2]);
    allTracks.items.forEach(async item => {
      const songInfo = await ytdl.getInfo(item.url_simple);
      const song = {
        title: songInfo.title,
        author: songInfo.author.name,
        url: songInfo.video_url,
      };
      serverQueue.songs.push(song);
    });
  }

  if (!serverQueue.connection) {
    try {
      var connection = await voiceChannel.join();
      serverQueue.connection = connection;
      play(message.guild, serverQueue.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  }
}

function skip(message, serverQueue) {
  if (!message.member.voiceChannel)
    return message.channel.send(
      'You have to be in a voice channel to stop the music!',
    );
  if (!serverQueue)
    return message.channel.send('There is no song that I could skip!');
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voiceChannel)
    return message.channel.send(
      'You have to be in a voice channel to stop the music!',
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .playStream(
      ytdl(song.url, {
        highWaterMark: 2 ^ 6,
        filter: 'audioonly',
      }),
    )
    .on('end', () => {
      console.log('Music ended!');
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on('error', error => {
      console.error(error);
    });
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

module.exports.run = async (client, msg, args) => {
  subCmdParser(client, msg, args);
};

module.exports.help = {
  name: 'music',
  alias: ['m'],
  description: 'Controls music playback',
  perms: '',
  syntax: 'music {play | vol | skip | stop | queue} [args...]',
};
