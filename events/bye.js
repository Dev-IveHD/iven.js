/**
 * @Author: Iven Beck
 * @Date:   2019-05-25T21:41:09+02:00
 * @Email:  ivenbeck@outlook.de
 * @Last modified by:   Iven Beck
 * @Last modified time: 2019-07-25T23:14:37+02:00
 */



let discord = require("discord.js");

module.exports.event = bot => {

  bot.on("guildMemberRemove", member => {

    let leaveembed = new discord.RichEmbed()
      .setDescription("Leave")
      .setColor("#ff7700")
      .addField("User", `${member} with ID: ${member.id}`)
      .setFooter(bot.user.username, bot.user.displayAvatarURL)
      .setTimestamp();

    let logChannel = member.guild.channels.find(channel => channel.name === "logs");
    if (logChannel) logChannel.send(leaveembed);
  });
};
