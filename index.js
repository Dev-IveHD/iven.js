/**
 * @Author: Iven Beck
 * @Date:   2019-05-25T16:17:50+02:00
 * @Email:  ivenbeck@outlook.de
 * @Last modified by:   Iven Beck
 * @Last modified time: 2019-08-07T20:19:30+02:00
 */

/*
 * Copyright (c) 2019. Iven Beck
 * You are free to use this code if you give it as a source.
 */

const discord = require("discord.js");
const botconfig = require("./botconfig.json");
const client = new discord.Client({
  disableEveryone: true
});
const fs = require("fs");
require('dotenv').config()

let token = process.env.TOKEN || botconfig.token
let prefix = process.env.PREFIX || botconfig.prefix

let commandcollection = client.commands = new discord.Collection();

fs.writeFile("./log.txt", formatLogMessage("Log started\n"), err => {
  if (err)
    return console.log("[ERROR] " + err);
});

// Initialize all commands in commands directory
fs.readdir("./commands/", (err, files) => {
  if (err) console.log(err);
  console.log("_".repeat(10) + "\nCommands");
  let jsfile = files.filter(f => f.split(".")
    .pop() === "js");
  jsfile.forEach((f) => {
    let props = require(`./commands/${f}`);
    if (!f.startsWith("!") && props.help.name != null) {
      try {
        client.commands.set(props.help.name.toLowerCase(), props);
        console.log(`+ ${f} loaded.`);
      } catch (e) {
        console.log(`An error occured in File ${f}:\n${e}`);
      }
    }
  });
  console.log("\n");
});


fs.readdir("./events/", (err, file) => {
  if (err) console.log(err);
  console.log("_".repeat(10) + "\nEvents");
  let jsfile = file.filter(f => f.split(".")
    .pop() === "js");
  jsfile.forEach((f) => {
    let props = require(`./events/${f}`);
    if (!f.startsWith("!")) {
      console.log(`+ ${f} loaded.`);
      props.event(client);
    }
  });
  console.log("\n");
});

client.on("ready", () => {
  console.log("[INFO] Bot is ready!");
  client.user.setActivity(`Use ${prefix}help for a list of commands`)
    .catch(e => console.log(`[ERR] Activity Error:\n${e}`));
});

client.on("message", message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") {
    message.channel.send("Sorry fellow human, sadly I'm only functional in guild chats.");
    return;
  }
  if (!message.content.startsWith(prefix, 0)) return;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0].toLowerCase();
  let args = messageArray.slice(1);
  let commandfile = client.commands.get(cmd.slice(prefix.length));
  if (commandfile) {
    commandfile.run(client, message, args);
  }
  fs.appendFileSync("./log.txt", formatLogMessage(`${message.author.username}#${message.author.discriminator} issued command ${message}`));
});

client.login(token)
  .catch(e => console.log(`[ERR] Login error:\n${e}`));

client.on('error', err => {
  // Normally only occurs on Hibernate --> Can be ignored because it auto reconnects
  if (err.error.errno == "EHOSTUNREACH" || err.error.errno == "") return;
  console.error(err.error);
});

/*
client.on('debug', info => {
  console.log(info);
});
*/

function formatLogMessage(message) {
  let date = new Date();
  let hours = date.getHours()
    .toString();
  let minutes = date.getMinutes()
    .toString();
  let seconds = date.getSeconds()
    .toString();
  let milliseconds = date.getMilliseconds()
    .toString();

  if (hours === "0") hours = "00";
  else if (hours.length < 2) hours = "0" + hours;

  if (minutes === "0") minutes = "00";
  else if (minutes.length < 2) minutes = "0" + minutes;

  if (seconds === "0") seconds = "00";
  else if (seconds.length < 2) seconds = "0" + seconds;

  if (milliseconds === "0") milliseconds = "00";
  else if (milliseconds.length < 2) milliseconds = "00" + milliseconds;
  else if (milliseconds.length < 3) milliseconds = "0" + milliseconds;

  return `[${hours}:${minutes}:${seconds}:${milliseconds}]  |  ${message}\n`;
}

module.exports.commandcollection = commandcollection;