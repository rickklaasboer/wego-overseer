FROM node:16

WORKDIR /usr/overseer

COPY . .

# install dependencies
RUN yarn install --frozen-lockfile

# run migrations
RUN yarn knex migrate:latest

CMD ["node", "-r", "tsconfig-paths/register", "-r", "ts-node/register", "./src/index.ts"]