FROM mcr.microsoft.com/playwright:bionic

RUN apt-get update && \
    apt-get -y install locales fonts-ipafont fonts-ipaexfont && \
    echo "ja_JP UTF-8" > /etc/locale.gen && locale-gen

COPY package.json .
RUN npm install
COPY generate.js .
RUN npm install -g
WORKDIR /work
ENTRYPOINT [ "svg2pdf" ]
