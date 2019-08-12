/**
 * @Author: Iven Beck
 * @Date:   2019-05-25T16:39:13+02:00
 * @Email:  ivenbeck@outlook.de
 * @Last modified by:   Iven Beck
 * @Last modified time: 2019-07-25T23:12:39+02:00
 */



let discord = require("discord.js");
let fs = require("fs");

let list_types = ["intro"];

module.exports.run = (client, message, args) => {
  if (!args[0]) {

    let subliststr = "";
    list_types.forEach(e => {
      subliststr += e + "\n";
    });

    let embed = new discord.RichEmbed({
      title: "Lists",
      description: "Here you can find possible sublists."
    });
    embed.setFooter(client.user.username, client.user.avatarURL);
    embed.addField("Sublists", subliststr, true);
    message.channel.send(embed);
    return;
  }

  switch (args[0].toLowerCase()) {

    case "intro":
      let embed = new discord.RichEmbed({
        title: "Intro Songs",
        description: "Here you can find Users that have custom join sounds."
      });

      let usersoundf = JSON.parse(fs.readFileSync("./files/usersounds.json", "utf8"));

      for (let key in usersoundf) {
        embed.addField("ID: " + key, usersoundf[key]);
      }

      message.channel.send(embed);

      break;
    default:
      message.reply("This list does not exist!");
  }

};
module.exports.help = {
  name: "list",
  description: "Lists various bot-related things things",
  perms: "",
  syntax: "list {sublist}"
};
