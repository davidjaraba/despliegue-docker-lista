FROM node:lts-slim


WORKDIR /usr/src/app

COPY package*.json ./
COPY index.js ./
COPY public ./public

RUN npm install


CMD [ "node", "index.js" ]