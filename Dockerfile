FROM node:14
WORKDIR /app
COPY package*.json /app
RUN npm ci --only=production
COPY ./src /app
EXPOSE 3000
CMD [ "node", "./src/main.js" ]