FROM node:16.0.0-alpine

ADD . /app/

WORKDIR /app

RUN npm install && npm run build && rm -rf \
    src \
    dockerfile \
    package-lock.json \
    tsconfig.json \
    && npm cache clean --force

EXPOSE 3000

CMD npm run start
