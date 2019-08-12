/**
 * @Author: Iven Beck
 * @Date:   2019-05-25T18:23:59+02:00
 * @Email:  ivenbeck@outlook.de
 * @Last modified by:   Iven Beck
 * @Last modified time: 2019-07-25T23:14:47+02:00
 */



let discord = require("discord.js");

module.exports.event = bot => {

  bot.on("guildMemberAdd", member => {

    var autorole = member.guild.roles.find(r => r.name === "Member");
    if (autorole) member.addRole(autorole);

    let servericon = member.guild.iconURL;
    member.send('', new discord.RichEmbed()
      .setColor(0x29B6F6)
      .setThumbnail(servericon)
      .setDescription(`Welcome ${member} to`)
      .addField("Server", member.guild)
      .addField("Owner", member.guild.owner));

    let joinembed = new discord.RichEmbed()
      .setDescription("Join")
      .setColor("#ff7700")
      .addField("User", `${member} with ID: ${member.id}`)
      .setFooter(bot.user.username, bot.user.displayAvatarURL)
      .setTimestamp();

    let logChannel = member.guild.channels.find(channel => channel.name === "logs");
    if (logChannel) logChannel.send(joinembed);
  });
};
