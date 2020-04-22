const got = require('got');

module.exports.run = (bot, msg) => {
  got('https://www.reddit.com/r/jokes/random/.json').then((response) => {
    let content = JSON.parse(response.body);
    var title = content[0].data.children[0].data.title;
    var joke = content[0].data.children[0].data.selftext;
    msg.channel.send('**' + title + '**');
    msg.channel.send(joke);
  });
};

module.exports.help = {
  name: 'joke',
  description: 'Fetches a joke from r/joke',
  perms: '',
  syntax: 'joke',
};
