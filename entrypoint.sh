#! /bin/bash

yarn knex migrate:latest

node -r tsconfig-paths/register -r ts-node/register ./src/index.ts