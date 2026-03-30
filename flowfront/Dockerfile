FROM node:20 as builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY ./ ./

RUN npm run build