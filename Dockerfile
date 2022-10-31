FROM node:16.15.0-alpine
WORKDIR /usr/app/clean-node-alpine
COPY package*.json .
RUN npm install --only=prod
COPY ./dist ./dist
EXPOSE 3000
CMD npm start