FROM node:16

WORKDIR /usr/overseer

COPY . .

# install dependencies
RUN yarn install --frozen-lockfile

CMD ["./wait-for-it.sh" , "172.21.0.2:3306" , "--strict" , "--timeout=300" , "--" , "./entrypoint.sh"]