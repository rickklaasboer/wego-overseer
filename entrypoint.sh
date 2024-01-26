#! /bin/bash

./wait-for-it.sh $DB_HOST:3306 --strict --timeout=300

yarn knex migrate:latest

node dist/app.js
