const got = require('got');
const Discord = require('discord.js');

module.exports.run = (bot, msg) => {
  const embed = new Discord.RichEmbed();
  got('https://www.reddit.com/r/memes/random/.json').then(response => {
    let content = JSON.parse(response.body);
    let permalink = content[0].data.children[0].data.permalink;
    let memeUrl = `https://reddit.com${permalink}`;
    let memeImage = content[0].data.children[0].data.url;
    let memeTitle = content[0].data.children[0].data.title;
    let memeUpvotes = content[0].data.children[0].data.ups;
    let memeDownvotes = content[0].data.children[0].data.downs;
    let memeNumComments = content[0].data.children[0].data.num_comments;
    embed.addField(`${memeTitle}`, `[View thread](${memeUrl})`);
    embed.setImage(memeImage);
    embed.setFooter(`👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComments}`);
    msg.channel.send(embed);
  });
};

module.exports.help = {
  name: 'meme',
  description: 'Fetches a meme from r/memes',
  perms: '',
  syntax: 'meme',
};