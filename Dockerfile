FROM node:latest
WORKDIR /usr/src/app

RUN apt-get update
RUN npm install yarn -g

RUN apt install ffmpeg -y -qq

COPY package*.json ./
COPY yarn.lock ./
RUN yarn

COPY . .

CMD yarn start