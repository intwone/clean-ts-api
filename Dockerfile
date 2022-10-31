FROM node:16.15.0-alpine
WORKDIR /usr/src/clean-node-api
COPY package*.json .
RUN npm install --only=prod