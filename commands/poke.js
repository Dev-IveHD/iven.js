/**
 * @Author: Iven Beck
 * @Date:   2019-05-25T16:17:50+02:00
 * @Email:  ivenbeck@outlook.de
 * @Last modified by:   Iven Beck
 * @Last modified time: 2019-07-25T23:11:39+02:00
 */



const discord = require("discord.js");

module.exports.run = (bot, message, args) => {
  let user = message.guild.member(message.mentions.users.first());
  if (!user) return message.channel.send("Error: `User not found`");

  args.shift();

  let text = args.join(" ");

  if (!args[1]) {
    user.send(new discord.RichEmbed()
      .setColor("#FFFF00")
      .setTitle(`:point_right::skin-tone-5: STUPS`)
      .setDescription(`${user}, you have been poked!`)
      .addField(`By`, message.author)
    );
  } else {
    user.send(new discord.RichEmbed()
      .setColor("#FFFF00")
      .setTitle(`:point_right::skin-tone-5: STUPS`)
      .setDescription(`${user}, you have been poked!`)
      .addField(`By`, message.author)
      .addField(`Message`, text)
    );
  }

  message.delete();
  message.channel.send(`:white_check_mark: ${user} was successfully poked`)
    .then(m => m.delete(10000));
};

module.exports.help = {
  name: "poke",
  description: "Pokes a user, so you don't need to dm them",
  perms: "",
  syntax: "poke {mention} [message]"
};
