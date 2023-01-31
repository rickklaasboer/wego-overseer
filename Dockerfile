FROM node:18

WORKDIR /usr/overseer

COPY . .

# install dependencies
RUN yarn install --frozen-lockfile

RUN chmod +x entrypoint.sh
RUN chmod +x wait-for-it.sh

CMD ["/bin/bash", "./entrypoint.sh"]