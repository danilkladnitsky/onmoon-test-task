FROM node:lts-alpine
WORKDIR /app

COPY ./frontend ./frontend
COPY ./shared/ ./shared

WORKDIR /app/frontend

RUN npm install

EXPOSE 5173