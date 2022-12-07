FROM node:18-alpine as base

WORKDIR /src
COPY package*.json ./

FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY ./.sequelizerc ./
COPY ./db ./db
COPY ./config ./config
CMD ["npm", "run", "migration:migrate"]

FROM base as development
ENV NODE_ENV=development
RUN npm install
COPY ./.sequelizerc ./
COPY ./db ./db
COPY ./config ./config
CMD ["npm", "run", "migration:migrate"]
