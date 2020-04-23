/**
 * @Author: Iven Beck
 * @Date:   2019-05-25T16:17:50+02:00
 * @Email:  ivenbeck@outlook.de
 * @Last modified by:   Iven Beck
 * @Last modified time: 2019-07-25T23:13:01+02:00
 */

const discord = require('discord.js');

module.exports.run = (client, msg) => {
  const embed = new discord.MessageEmbed({
    title: 'Docs',
    description:
      'You can find the bots GitLab repository [here](https://gitlab.com/disbots/iven.js).',
  });
  embed.setFooter(client.user.username, client.user.avatarURL);
  embed.addField(
    'Support Email',
    '`incoming+disbots-iven-js-10430829-issue-@incoming.gitlab.com`',
  );

  msg.channel.send(embed);
};

module.exports.help = {
  name: 'docs',
  description: 'Sends a link to the bots repository',
  perms: '',
  syntax: 'docs',
};
