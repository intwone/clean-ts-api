FROM node:16.15.0-alpine
WORKDIR /usr/app/clean-node-alpine
COPY package*.json .
RUN npm install --only=prod