#! /bin/bash

./wait-for-it.sh $DB_HOST:3306 --strict --timeout=300

yarn knex migrate:latest

node -r tsconfig-paths/register -r ts-node/register ./src/index.ts