/**
 * @Author: Iven Beck
 * @Date:   2019-05-25T16:17:50+02:00
 * @Email:  ivenbeck@outlook.de
 * @Last modified by:   Iven Beck
 * @Last modified time: 2019-07-25T23:11:56+02:00
 */


module.exports.run = (bot, msg, args) => {
  let base = "Pong!\n";

  if (msg.member.roles) {
    let rolestring = "";
    msg.member.roles.forEach(r => {
      rolestring += r.name + ", ";
    });
    rolestring = rolestring.substr(0, rolestring.length - 2);
    base += "Roles: `" + rolestring + "`\n";
  }

  if (args.length > 0) {
    let argsstring = "";
    args.forEach(a => {
      argsstring += a + ", ";
    });
    argsstring = argsstring.substr(0, argsstring.length - 2);
    base += "Args: `" + argsstring + "`\n";
  }

  msg.channel.send(base);
};

module.exports.help = {
  name: "ping",
  description: "Tests if the bots I/O System is working",
  perms: "",
  syntax: "ping [text]"
};
