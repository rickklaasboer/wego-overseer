FROM node:18

WORKDIR /app

COPY . .

# install dependencies
RUN yarn install --frozen-lockfile

# build app
RUN yarn build

RUN chmod +x entrypoint.sh
RUN chmod +x wait-for-it.sh

CMD ["/bin/bash", "./entrypoint.sh"]