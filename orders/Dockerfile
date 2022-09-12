FROM node:16-alpine

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install --only=prod
RUN npm run build
COPY ./config ./
COPY ./contract ./
COPY ./index.js ./

CMD ["npm", "start"]
