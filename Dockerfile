FROM node:7.1

# Create app directory
RUN mkdir -p /app
WORKDIR /app

RUN npm install -g bower
COPY bower.json /app/
RUN bower install --allow-root

COPY package.json /app/
RUN npm install

COPY . /app

EXPOSE 3000

CMD [ "npm", "start" ]
