# syntax=docker/dockerfile:1
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install --production --no-audit --no-fund

COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]
