/**
 * @Author: Iven Beck
 * @Date:   2019-05-25T16:17:50+02:00
 * @Email:  ivenbeck@outlook.de
 * @Last modified by:   Iven Beck
 * @Last modified time: 2019-07-25T23:13:57+02:00
 */



module.exports.run = (bot, msg, args) => {
  if (args.length === 0) {
    msg.channel.send(msg.author.avatarURL);
  }
  let user;
  if (args.length === 1) {
    try {
      user = msg.mentions.users.first();
      if (user.avatarURL) msg.channel.send(user.avatarURL);
      else if (user.defaultAvatarURL) msg.channel.send(user.defaultAvatarURL);
    } catch (e) {
      msg.channel.send("Query Error: `Invalid User`");
    }
  }
};

module.exports.help = {
  name: "avatar",
  description: "Gets an users avatar and sends it",
  perms: "",
  syntax: "avatar [user]"
};
