FROM debian:buster

FROM debian:buster
RUN apt-get update -yq \
&& apt-get install curl gnupg -yq \
&& curl -sL https://deb.nodesource.com/setup_16.x | bash \
&& apt-get install nodejs -yq \
&& apt-get clean -y \
&& apt-get install -y \
    ffmpeg

ADD . /app/

WORKDIR /app

RUN npm install

EXPOSE 3000

CMD npm run dev
