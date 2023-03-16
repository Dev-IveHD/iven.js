FROM node:14.21.3
WORKDIR /usr/src/app

RUN apt-get update && apt-get install ffmpeg -y --no-install-recommends -qq \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY yarn.lock ./
RUN yarn

COPY . .

CMD yarn start