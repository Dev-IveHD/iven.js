# iven.js

A modular, interactive Discord Bot realized in NodeJS.

[![CircleCI](https://circleci.com/gh/ibveecnk/iven.js/tree/master.svg?style=svg)](https://circleci.com/gh/ibveecnk/iven.js/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

```
Node.js 8.12.0 or higher
```

### Installing

## Docker

A step by step series of examples that tell you how to get the docker image up and running

Pull the image

```
$ docker pull ivehd/iven-js:latest
```

Start the container

```
$ docker run -e TOKEN=TOKEN_GOES_HERE -e PREFIX=- ivehd/iven-js
```

## Manual

A step by step series of examples that tell you how to get the bot up and running

Clone git repository

```
$ git clone https://github.com/ibveecnk/iven.js.git
```

Install dependencies

```
$ yarn install
```

Install FFMPEG for your os (if not installed prefix music.js `commands/music.js` with `!`

Change token and prefix in process.env by creating a .env file

```
TOKEN=
PREFIX=-
```

Run the bot

```
$ yarn start
```

After having the bot added to a guild, try sending $ping ($ ressembles your prefix) and the bot should reply.
If that however doesn't work, please contact me via discord `@Iven#8562`

## Built With

- [Node.js](https://nodejs.org/)
- [Discord.js](https://discord.js.org/#/) - Discord API implementation

## Versioning

This project uses [SemVer](http://semver.org/) for versioning.

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) file for details

## Authors

- **Iven Beck** - _Maintainer_ - [dev.ib](https://github.com/ibveecnk)

## License

See [LICENSE](LICENSE.md) file for details
