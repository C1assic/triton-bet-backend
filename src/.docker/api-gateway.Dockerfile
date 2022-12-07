FROM node:18-alpine as base

WORKDIR /src
COPY package*.json ./
EXPOSE 8080

FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY . ./
CMD ["node", "apiGateway"]

FROM base as development
ENV NODE_ENV=development
RUN npm install
COPY . ./
CMD ["node", "apiGateway"]
