FROM node:alpine as builder
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./

COPY ./ ./
RUN npm i
CMD ["npm", "run", "dev"]
EXPOSE 3000