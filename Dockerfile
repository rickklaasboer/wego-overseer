FROM node:16

WORKDIR /usr/overseer

COPY . .

RUN yarn install --frozen-lockfile

CMD ["node", "-r", "tsconfig-paths/register", "-r", "ts-node/register", "./src/index.ts"]