/* eslint-disable global-require */
/* eslint-disable no-console */
/* global process */
/**
 * @Author: Iven Beck
 * @Date:   2019-05-25T16:17:50+02:00
 * @Email:  ivenbeck@outlook.de
 * @Last modified by:   Iven Beck
 * @Last modified time: 2019-08-07T20:19:30+02:00
 */

const discord = require('discord.js');
const fs = require('fs');
const presence = require('./presence.json');

const client = new discord.Client({
  disableEveryone: true,
});
require('dotenv').config();

const token = process.env.TOKEN;
const prefix = process.env.PREFIX;

function formatLogMessage(message) {
  const date = new Date();
  let hours = date.getHours().toString();
  let minutes = date.getMinutes().toString();
  let seconds = date.getSeconds().toString();
  let milliseconds = date.getMilliseconds().toString();

  if (hours === '0') hours = '00';
  else if (hours.length < 2) hours = `0${hours}`;

  if (minutes === '0') minutes = '00';
  else if (minutes.length < 2) minutes = `0${minutes}`;

  if (seconds === '0') seconds = '00';
  else if (seconds.length < 2) seconds = `0${seconds}`;

  if (milliseconds === '0') milliseconds = '00';
  else if (milliseconds.length < 2) milliseconds = `00${milliseconds}`;
  else if (milliseconds.length < 3) milliseconds = `0${milliseconds}`;

  return `[${hours}:${minutes}:${seconds}:${milliseconds}]  |  ${message}\n`;
}

function setPresence(client) {
  var choice = presence.txt[Math.floor(Math.random() * presence.txt.length)];

  client.user
    .setActivity(choice)
    .catch(e => console.log(`[ERR] Activity Error:\n${e}`));
  return;
}

client.commands = new discord.Collection();
const commandcollection = client.commands;

fs.writeFile('./log.txt', formatLogMessage('Log started\n'), err => {
  if (err) return console.log(`[ERROR] ${err}`);
  return true;
});

// Initialize all commands in commands directory
fs.readdir('./commands/', (err, files) => {
  if (err) console.log(err);
  console.log(`${'_'.repeat(10)}\nCommands`);
  const jsfile = files.filter(f => f.split('.').pop() === 'js');
  jsfile.forEach(f => {
    const props = require(`./commands/${f}`);
    if (!f.startsWith('!') && props.help.name != null) {
      try {
        client.commands.set(props.help.name.toLowerCase(), props);
        if (props.help.alias) {
          props.help.alias.forEach(alias => {
            client.commands.set(alias.toLowerCase(), props);
          });
        }
        console.log(`+ ${f} loaded.`);
      } catch (e) {
        console.log(`An error occured in File ${f}:\n${e}`);
      }
    }
  });
  console.log('\n');
});

fs.readdir('./events/', (err, file) => {
  if (err) console.log(err);
  console.log(`${'_'.repeat(10)}\nEvents`);
  const jsfile = file.filter(f => f.split('.').pop() === 'js');
  jsfile.forEach(f => {
    const props = require(`./events/${f}`);
    if (!f.startsWith('!')) {
      console.log(`+ ${f} loaded.`);
      props.event(client);
    }
  });
  console.log('\n');
});

client.on('ready', () => {
  console.log('[INFO] Bot is ready!');
  setInterval(function () {
    setPresence(client);
  }, presence.interval);
});

client.on('message', message => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm') {
    message.channel.send(
      ":children_crossing: Sorry, I'm only functional in guild chats.",
    );
    return;
  }
  if (!message.content.startsWith(prefix, 0)) return;
  const messageArray = message.content.split(' ');
  const cmd = messageArray[0].toLowerCase();
  const args = messageArray.slice(1);
  const commandfile = client.commands.get(cmd.slice(prefix.length));
  if (commandfile) {
    commandfile.run(client, message, args);
  }
  fs.appendFileSync(
    './log.txt',
    formatLogMessage(
      `${message.author.username}#${message.author.discriminator} issued command ${message}`,
    ),
  );
});

client.login(token).catch(e => console.error(`Login error:\n${e}`));

client.on('error', err => {
  // Normally only occurs on Server going to standby and being reawakened --> Can be ignored because it auto reconnects
  if (err.error.errno === 'EHOSTUNREACH' || err.error.errno === '') return;
  console.error(err.error);
});

/*
client.on('debug', info => {
  console.log(info);
});
*/

module.exports.commandcollection = commandcollection;