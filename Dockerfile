FROM node:16

WORKDIR /usr/overseer

COPY . .

# install dependencies
RUN yarn install --frozen-lockfile

CMD ["/bin/bash", "./entrypoint.sh"]