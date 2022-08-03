FROM node:16.0.0-alpine

ADD . /app/

WORKDIR /app

RUN npm install && npm run build

EXPOSE 3000

CMD npm run start
