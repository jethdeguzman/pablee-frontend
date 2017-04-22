FROM node:7.1

# Create app directory
RUN mkdir -p /app
WORKDIR /app

COPY package.json /app/
RUN npm install

COPY . /app

EXPOSE 3000

CMD [ "npm", "start" ]
