FROM node:lts-alpine
WORKDIR /app

COPY ./backend ./backend
COPY ./shared/ ./shared

WORKDIR /app/backend

RUN npm install

RUN npm run build